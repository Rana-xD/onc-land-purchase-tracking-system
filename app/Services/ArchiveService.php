<?php

namespace App\Services;

use App\Models\Buyer;
use App\Models\Seller;
use App\Models\Land;
use App\Models\Commission;
use App\Models\DocumentCreation;
use App\Models\SaleContract;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ArchiveService
{
    /**
     * Get all archived items grouped by type
     */
    public function getAllArchived()
    {
        return [
            'buyers' => Buyer::onlyTrashed()->with('deletedBy')->get(),
            'sellers' => Seller::onlyTrashed()->with('deletedBy')->get(),
            'lands' => Land::onlyTrashed()->with('deletedBy')->get(),
            'commissions' => Commission::onlyTrashed()->with('deletedBy')->get(),
            'document_creations' => DocumentCreation::onlyTrashed()->with('deletedBy')->get(),
            'sale_contracts' => SaleContract::onlyTrashed()->with('deletedBy')->get(),
            'users' => User::onlyTrashed()->with('deletedBy')->get(),
            'roles' => Role::onlyTrashed()->with('deletedBy')->get(),
        ];
    }

    /**
     * Get archived statistics
     */
    public function getStatistics()
    {
        return [
            'data_entry' => [
                'buyers' => Buyer::onlyTrashed()->count(),
                'sellers' => Seller::onlyTrashed()->count(),
                'lands' => Land::onlyTrashed()->count(),
            ],
            'contracts' => [
                'document_creations' => DocumentCreation::onlyTrashed()->count(),
                'sale_contracts' => SaleContract::onlyTrashed()->count(),
            ],
            'commissions' => [
                'total' => Commission::onlyTrashed()->count(),
                'pre_purchase' => Commission::onlyTrashed()->where('commission_type', 'pre_purchase')->count(),
                'post_purchase' => Commission::onlyTrashed()->where('commission_type', 'post_purchase')->count(),
            ],
            'users' => [
                'users' => User::onlyTrashed()->count(),
                'roles' => Role::onlyTrashed()->count(),
            ],
        ];
    }

    /**
     * Get archived items by type
     */
    public function getArchivedByType($type)
    {
        $query = match($type) {
            'buyers' => Buyer::onlyTrashed(),
            'sellers' => Seller::onlyTrashed(),
            'lands' => Land::onlyTrashed(),
            'commissions' => Commission::onlyTrashed(),
            'document_creations' => DocumentCreation::onlyTrashed(),
            'sale_contracts' => SaleContract::onlyTrashed(),
            'users' => User::onlyTrashed(),
            'roles' => Role::onlyTrashed(),
            default => null,
        };

        if (!$query) {
            return collect();
        }

        // Add relationship for who deleted the item
        return $query->with(['deletedBy' => function($q) {
            $q->select('id', 'name');
        }])->get();
    }

    /**
     * Restore an archived item
     */
    public function restore($type, $id)
    {
        $model = $this->getModelByType($type, $id);
        
        if (!$model) {
            return false;
        }

        DB::transaction(function() use ($model, $type) {
            Log::info('Starting restore operation', [
                'type' => $type,
                'model_id' => $model->id,
                'model_deleted_at_before' => $model->deleted_at
            ]);
            
            // Restore the main model
            $model->restore();
            $model->deleted_by = null;
            $model->save();
            
            Log::info('Main model restored', [
                'type' => $type,
                'model_id' => $model->id,
                'model_deleted_at_after' => $model->deleted_at
            ]);
            
            // Handle special cases for models with critical relationships
            if ($type === 'sale_contracts') {
                $this->restoreSaleContractRelations($model);
            } elseif ($type === 'document_creations') {
                $this->restoreDocumentCreationRelations($model);
            }
            
            Log::info('Restore operation completed', [
                'type' => $type,
                'model_id' => $model->id
            ]);
        });

        return true;
    }

    /**
     * Restore related records for sale contract
     */
    private function restoreSaleContractRelations($saleContract)
    {
        Log::info('Restoring sale contract relations', [
            'sale_contract_id' => $saleContract->id,
            'document_creation_id' => $saleContract->document_creation_id
        ]);
        
        // Restore the related document creation if it's soft deleted
        if ($saleContract->document_creation_id) {
            $documentCreation = DocumentCreation::onlyTrashed()
                ->find($saleContract->document_creation_id);
            
            Log::info('Document creation lookup', [
                'document_creation_found' => $documentCreation ? 'yes' : 'no',
                'document_creation_id' => $saleContract->document_creation_id
            ]);
            
            if ($documentCreation) {
                $documentCreation->restore();
                $documentCreation->deleted_by = null;
                $documentCreation->save();
                
                Log::info('Document creation restored', [
                    'document_creation_id' => $documentCreation->id,
                    'deleted_at' => $documentCreation->deleted_at
                ]);
                
                // Also restore payment steps for this document creation
                $this->restorePaymentSteps($documentCreation->id);
            }
        }
    }

    /**
     * Restore related records for document creation
     */
    private function restoreDocumentCreationRelations($documentCreation)
    {
        // Restore related sale contract if it exists and is soft deleted
        $saleContract = SaleContract::onlyTrashed()
            ->where('document_creation_id', $documentCreation->id)
            ->first();
            
        if ($saleContract) {
            $saleContract->restore();
            $saleContract->deleted_by = null;
            $saleContract->save();
        }
        
        // Restore payment steps for this document creation
        $this->restorePaymentSteps($documentCreation->id);
    }

    /**
     * Restore payment steps for a document creation
     * PaymentStep doesn't use soft deletes, so this is just a placeholder for future use
     */
    private function restorePaymentSteps($documentCreationId)
    {
        // PaymentStep model doesn't use soft deletes currently
        // This method is kept for future extensibility
        // Payment steps remain active even when document creation is soft deleted
    }

    /**
     * Permanently delete an archived item
     */
    public function permanentDelete($type, $id)
    {
        $model = $this->getModelByType($type, $id);
        
        if (!$model) {
            return false;
        }

        $model->forceDelete();
        return true;
    }

    /**
     * Archive an item (soft delete with tracking)
     */
    public function archive($type, $id)
    {
        $modelClass = $this->getModelClass($type);
        
        if (!$modelClass) {
            return false;
        }

        $model = $modelClass::find($id);
        
        if (!$model) {
            return false;
        }

        DB::transaction(function() use ($model, $type) {
            Log::info('Starting archive operation', [
                'type' => $type,
                'model_id' => $model->id
            ]);
            
            // Handle special cases for models with critical relationships
            if ($type === 'document_creations') {
                $this->archiveDocumentCreationRelations($model);
            } elseif ($type === 'sale_contracts') {
                $this->archiveSaleContractRelations($model);
            }
            
            // Archive the main model
            $model->deleted_by = Auth::id();
            $model->save();
            $model->delete();
            
            Log::info('Archive operation completed', [
                'type' => $type,
                'model_id' => $model->id
            ]);
        });

        return true;
    }

    /**
     * Archive related records for document creation
     */
    private function archiveDocumentCreationRelations($documentCreation)
    {
        Log::info('Archiving document creation relations', [
            'document_creation_id' => $documentCreation->id
        ]);
        
        // Archive related sale contract if it exists
        $saleContract = SaleContract::where('document_creation_id', $documentCreation->id)->first();
        
        if ($saleContract) {
            Log::info('Found related sale contract to archive', [
                'sale_contract_id' => $saleContract->id
            ]);
            
            $saleContract->deleted_by = Auth::id();
            $saleContract->save();
            $saleContract->delete();
        }
    }

    /**
     * Archive related records for sale contract
     */
    private function archiveSaleContractRelations($saleContract)
    {
        Log::info('Archiving sale contract relations', [
            'sale_contract_id' => $saleContract->id,
            'document_creation_id' => $saleContract->document_creation_id
        ]);
        
        // Archive the related document creation if it exists and isn't already archived
        if ($saleContract->document_creation_id) {
            $documentCreation = DocumentCreation::find($saleContract->document_creation_id);
            
            if ($documentCreation) {
                Log::info('Found related document creation to archive', [
                    'document_creation_id' => $documentCreation->id
                ]);
                
                $documentCreation->deleted_by = Auth::id();
                $documentCreation->save();
                $documentCreation->delete();
            }
        }
    }

    /**
     * Get model instance by type and ID
     */
    private function getModelByType($type, $id)
    {
        $modelClass = $this->getModelClass($type);
        
        if (!$modelClass) {
            return null;
        }

        return $modelClass::onlyTrashed()->find($id);
    }

    /**
     * Get model class by type string
     */
    private function getModelClass($type)
    {
        return match($type) {
            'buyers' => Buyer::class,
            'sellers' => Seller::class,
            'lands' => Land::class,
            'commissions' => Commission::class,
            'document_creations' => DocumentCreation::class,
            'sale_contracts' => SaleContract::class,
            'users' => User::class,
            'roles' => Role::class,
            default => null,
        };
    }
}

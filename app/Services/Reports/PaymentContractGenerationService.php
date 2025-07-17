<?php

namespace App\Services\Reports;

use App\Models\PaymentDocument;
use App\Models\PaymentStep;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use PDF;

class PaymentContractGenerationService
{
    /**
     * Generate a payment contract for a payment step
     *
     * @param PaymentStep $paymentStep
     * @param User $user
     * @return array
     */
    public function generateContract(PaymentStep $paymentStep, User $user): array
    {
        // Get the document creation and related data
        $documentCreation = $paymentStep->documentCreation;
        $saleContract = $documentCreation->saleContract;
        $land = $saleContract->land;
        
        // Generate PDF content
        $data = [
            'contract_id' => $saleContract->contract_id,
            'buyer_name' => $saleContract->buyer_name,
            'buyer_phone' => $saleContract->buyer_phone,
            'buyer_address' => $saleContract->buyer_address,
            'seller_name' => $saleContract->seller_name,
            'seller_phone' => $saleContract->seller_phone,
            'seller_address' => $saleContract->seller_address,
            'land_info' => [
                'plot_number' => $land->plot_number ?? 'N/A',
                'size' => $land->size ?? 'N/A',
                'location' => $land->location ?? 'N/A',
            ],
            'payment_step' => [
                'step_number' => $paymentStep->step_number,
                'description' => $paymentStep->payment_time_description,
                'amount' => $paymentStep->amount,
                'due_date' => $paymentStep->due_date->format('Y-m-d'),
            ],
            'generated_by' => $user->name,
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ];
        
        // Generate PDF file
        $pdf = PDF::loadView('reports.payment_contract', $data);
        
        // Create directory if it doesn't exist
        $directory = 'payment_contracts/' . $paymentStep->id;
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }
        
        // Save PDF file
        $fileName = 'payment_contract_' . $saleContract->contract_id . '_step_' . $paymentStep->step_number . '.pdf';
        $filePath = $directory . '/' . $fileName;
        Storage::disk('public')->put($filePath, $pdf->output());
        
        // Create payment document record
        $document = new PaymentDocument([
            'payment_step_id' => $paymentStep->id,
            'document_type' => 'payment_contract',
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size' => Storage::disk('public')->size($filePath),
            'mime_type' => 'application/pdf',
            'uploaded_by' => $user->id,
            'uploaded_at' => now(),
        ]);
        
        $document->save();
        
        // Update payment step status
        $paymentStep->payment_contract_created = true;
        $paymentStep->payment_contract_created_at = now();
        $paymentStep->payment_contract_created_by = $user->id;
        $paymentStep->status = 'contract_created';
        $paymentStep->save();
        
        return [
            'document' => $document,
            'file_path' => Storage::disk('public')->url($filePath),
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ArchiveService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ArchiveController extends Controller
{
    protected $archiveService;

    public function __construct(ArchiveService $archiveService)
    {
        $this->archiveService = $archiveService;
    }

    /**
     * Display the archive page
     */
    public function index()
    {
        $statistics = $this->archiveService->getStatistics();
        $archived = $this->archiveService->getAllArchived();

        return Inertia::render('Archive/Index', [
            'statistics' => $statistics,
            'archived' => $archived,
            'csrf_token' => csrf_token(),
        ]);
    }

    /**
     * Get archived items by type
     */
    public function getByType(Request $request, $type)
    {
        $items = $this->archiveService->getArchivedByType($type);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Restore an archived item
     */
    public function restore(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'id' => 'required|integer'
        ]);

        $success = $this->archiveService->restore($request->type, $request->id);

        if ($success) {
            return response()->json([
                'success' => true,
                'message' => 'ទិន្នន័យត្រូវបានស្ដារឡើងវិញដោយជោគជ័យ'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'មិនអាចស្ដារទិន្នន័យបានទេ'
        ], 400);
    }

    /**
     * Permanently delete an archived item (if needed)
     */
    public function permanentDelete(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'id' => 'required|integer'
        ]);

        $success = $this->archiveService->permanentDelete($request->type, $request->id);

        if ($success) {
            return response()->json([
                'success' => true,
                'message' => 'ទិន្នន័យត្រូវបានលុបជាអចិន្ត្រៃយ៍'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'មិនអាចលុបទិន្នន័យបានទេ'
        ], 400);
    }

    /**
     * Get archive statistics
     */
    public function statistics()
    {
        $statistics = $this->archiveService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }
}

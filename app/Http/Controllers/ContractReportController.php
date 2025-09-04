<?php

namespace App\Http\Controllers;

use App\Models\DocumentCreation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractReportController extends Controller
{
    public function index()
    {
        $contracts = DocumentCreation::with([
            'buyers.buyer',
            'sellers.seller', 
            'lands.land'
        ])
        ->whereIn('document_type', ['deposit_contract', 'sale_contract'])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Reports/ContractReportList', [
            'initialContracts' => $contracts
        ]);
    }

    public function apiList()
    {
        $contracts = DocumentCreation::with([
            'buyers.buyer',
            'sellers.seller', 
            'lands.land'
        ])
        ->whereIn('document_type', ['deposit_contract', 'sale_contract'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($contracts);
    }
}

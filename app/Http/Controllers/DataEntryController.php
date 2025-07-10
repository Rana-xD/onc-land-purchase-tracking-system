<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use App\Models\Land;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataEntryController extends Controller
{
    /**
     * Display the data entry category selection page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('DataEntry/CategorySelection');
    }

    /**
     * Display the buyers list page.
     *
     * @return \Inertia\Response
     */
    public function buyersIndex()
    {
        return Inertia::render('DataEntry/Buyers/Index');
    }

    /**
     * Display the create buyer page.
     *
     * @return \Inertia\Response
     */
    public function buyersCreate()
    {
        return Inertia::render('DataEntry/Buyers/Create');
    }

    /**
     * Display the edit buyer page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function buyersEdit($id)
    {
        $buyer = Buyer::with('documents')->findOrFail($id);
        return Inertia::render('DataEntry/Buyers/Edit', [
            'buyer' => $buyer,
            'documents' => $buyer->documents
        ]);
    }

    /**
     * Display the buyer details page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function buyersShow($id)
    {
        $buyer = Buyer::findOrFail($id);
        $documents = $buyer->documents;
        
        return Inertia::render('DataEntry/Buyers/Show', [
            'buyer' => $buyer,
            'documents' => $documents
        ]);
    }

    /**
     * Display the sellers list page.
     *
     * @return \Inertia\Response
     */
    public function sellersIndex()
    {
        return Inertia::render('DataEntry/Sellers/Index');
    }

    /**
     * Display the create seller page.
     *
     * @return \Inertia\Response
     */
    public function sellersCreate()
    {
        return Inertia::render('DataEntry/Sellers/Create');
    }

    /**
     * Display the edit seller page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function sellersEdit($id)
    {
        $seller = Seller::with('documents')->findOrFail($id);
        return Inertia::render('DataEntry/Sellers/Edit', [
            'seller' => $seller,
            'documents' => $seller->documents
        ]);
    }

    /**
     * Display the seller details page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function sellersShow($id)
    {
        $seller = Seller::findOrFail($id);
        $documents = $seller->documents;
        
        return Inertia::render('DataEntry/Sellers/Show', [
            'seller' => $seller,
            'documents' => $documents
        ]);
    }

    /**
     * Display the lands list page.
     *
     * @return \Inertia\Response
     */
    public function landsIndex()
    {
        return Inertia::render('DataEntry/Lands/Index');
    }

    /**
     * Display the create land page.
     *
     * @return \Inertia\Response
     */
    public function landsCreate()
    {
        return Inertia::render('DataEntry/Lands/Create');
    }

    /**
     * Display the edit land page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function landsEdit($id)
    {
        $land = Land::with('documents')->findOrFail($id);
        return Inertia::render('DataEntry/Lands/Edit', [
            'land' => $land,
            'documents' => $land->documents
        ]);
    }

    /**
     * Display the land details page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function landsShow($id)
    {
        $land = Land::findOrFail($id);
        $documents = $land->documents;
        
        return Inertia::render('DataEntry/Lands/Show', [
            'land' => $land,
            'documents' => $documents
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'category',
        'reference_id',
        'documentable_id',
        'documentable_type',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'is_display',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_display' => 'boolean',
        'file_size' => 'integer',
    ];

    /**
     * Get the owner of this document based on category.
     */
    public function owner()
    {
        // Support both old and new relationship styles during transition
        if ($this->documentable_type && $this->documentable_id) {
            return $this->documentable();
        }
        
        // Legacy relationship using category and reference_id
        return match($this->category) {
            'buyer' => $this->belongsTo(Buyer::class, 'reference_id'),
            'seller' => $this->belongsTo(Seller::class, 'reference_id'),
            'land' => $this->belongsTo(Land::class, 'reference_id'),
            default => null,
        };
    }
    
    /**
     * Get the parent documentable model (buyer, seller, land, etc).
     */
    public function documentable()
    {
        return $this->morphTo();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Land extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'plot_number',
        'date_of_registration',
        'size',
        'location',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_registration' => 'date',
        'size' => 'decimal:2',
    ];

    /**
     * Get the documents for the land.
     */
    public function documents()
    {
        // Support both relationship types for backward compatibility
        return $this->morphMany(Document::class, 'documentable')
            ->orWhere(function($query) {
                $query->where('reference_id', $this->id)
                      ->where('category', 'land');
            });
    }

    /**
     * Get the display document for the land.
     */
    public function displayDocument()
    {
        // Support both relationship types for backward compatibility
        return $this->morphOne(Document::class, 'documentable')
            ->where('is_display', true)
            ->orWhere(function($query) {
                $query->where('reference_id', $this->id)
                      ->where('category', 'land')
                      ->where('is_display', true);
            });
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}

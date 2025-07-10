<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Land extends Model
{
    use HasFactory;

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
        return $this->hasMany(Document::class, 'reference_id')
            ->where('category', 'land');
    }

    /**
     * Get the display document for the land.
     */
    public function displayDocument()
    {
        return $this->hasOne(Document::class, 'reference_id')
            ->where('category', 'land')
            ->where('is_display', true);
    }
}

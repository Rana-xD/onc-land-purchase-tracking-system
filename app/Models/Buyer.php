<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'sex',
        'date_of_birth',
        'identity_number',
        'address',
        'phone_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the documents for the buyer.
     */
    public function documents()
    {
        return $this->hasMany(Document::class, 'reference_id')
            ->where('category', 'buyer');
    }

    /**
     * Get the display document for the buyer.
     */
    public function displayDocument()
    {
        return $this->hasOne(Document::class, 'reference_id')
            ->where('category', 'buyer')
            ->where('is_display', true);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Buyer extends Model
{
    use HasFactory, SoftDeletes;

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
        'front_image_path',
        'back_image_path',
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
        // Support both relationship types during transition
        $polymorphicDocs = $this->morphMany(Document::class, 'documentable');
        
        // If no polymorphic documents exist yet, fall back to the old relationship
        if ($polymorphicDocs->count() === 0) {
            return $this->hasMany(Document::class, 'reference_id')
                ->where('category', 'buyer');
        }
        
        return $polymorphicDocs;
    }

    /**
     * Get the display document for the buyer.
     */
    public function displayDocument()
    {
        // Support both relationship types during transition
        $polymorphicDoc = $this->morphOne(Document::class, 'documentable')
            ->where('is_display', true);
        
        // If no polymorphic display document exists yet, fall back to the old relationship
        if ($polymorphicDoc->count() === 0) {
            return $this->hasOne(Document::class, 'reference_id')
                ->where('category', 'buyer')
                ->where('is_display', true);
        }
        
        return $polymorphicDoc;
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}

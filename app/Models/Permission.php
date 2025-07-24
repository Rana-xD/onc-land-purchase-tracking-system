<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'module',
        'action',
    ];

    /**
     * Get the roles that have this permission.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions')
                    ->withTimestamps();
    }

    /**
     * Get permissions grouped by module.
     */
    public static function getByModule()
    {
        return static::orderBy('module')->orderBy('action')->get()->groupBy('module');
    }

    /**
     * Get all available modules.
     */
    public static function getModules()
    {
        return static::distinct('module')->pluck('module')->sort()->values();
    }
}

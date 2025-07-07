<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'role' => 'string',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }
    
    
    /**
     * Check if the user has the given role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
    
    /**
     * Check if the user is an administrator.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('administrator');
    }
    
    /**
     * Check if the user is a manager.
     *
     * @return bool
     */
    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }
    
    /**
     * Check if the user is a staff member.
     *
     * @return bool
     */
    public function isStaff(): bool
    {
        return $this->hasRole('staff');
    }
}

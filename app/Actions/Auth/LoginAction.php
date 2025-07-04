<?php
declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Timebox;

class LoginAction
{
    /**
     * @param string $email
     * @param string $password
     * @return array{token: string, user: User}
     */
    public function execute(string $email, string $password): array
    {
        // This will fix the execution time of the action to prevent timing attacks
        return (new Timebox)->call(function ($timebox) use ($email, $password) {
            $user = User::where('email', $email)->first();
            // dummy hash if user doesn't exist
            $hashedPassword = $user?->password ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
            
            if (!$user || !Hash::check($password, $hashedPassword)) {
                throw new \Exception('Invalid credentials');
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'token' => $token,
                'user' => $user,
            ];
        }, microseconds: 300000);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Skills_Category;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $role = strtolower($request->input('role'));


        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:' . ($role === 'worker' ? 'workers' : 'customers'),
            'password' => 'required|min:8 |max:100',
            'city' => 'required|string|max:100|min:3',
            'gender' => 'required|in:male,female',
            'phone' => 'required|string|regex:/^\+?[0-9]{10,15}$/|min:11|max:13',
            'cnic' => 'required|string|min:15|max:15',
            'role' => 'required|in:customer,worker',
        ];


        if ($role === 'worker') {
            $rules = array_merge($rules, [
                'skill_category' => 'required|in:electrician,plumber,painter,carpenter,mechanic',
                'experience' => 'required|integer|min:0',
                'daily_charge' => 'required|integer|min:0',
                'availability' => 'boolean',
                'bio' => 'nullable|string|max:500',
            ]);
        }

        $validated = $request->validate($rules);

        if ($role === 'worker')
        {

            $id=Skills_Category::where('name',$validated['skill_category'])->value('id');


            $user = Worker::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'city' => $validated['city'],
                'gender' => $validated['gender'],
                'phone' => $validated['phone'],
                'role' => 'worker',
                'cnic' => $validated['cnic'],
                'skills_id' => $id,
                'experience' => $validated['experience'],
                'daily_charge' => $validated['daily_charge'],
                'availability' => $validated['availability'] ?? true,
                'bio' => $validated['bio'] ?? '',
            ]);
        }
        else
        {
            $user = Customer::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'city' => $validated['city'],
                'gender' => $validated['gender'],
                'phone' => $validated['phone'],
                'role' => 'customer',
                'cnic' => $validated['cnic'],
            ]);
        }
        $token=Auth::login($user);
        // ✅ Return response
        return response()->json([
            'success' => true,
            'message' => 'Registered successfully as ' . ucfirst($role),
            'user' => $user,
            'Authorization' => [
                'token' => $token,
                'token_type' => 'bearer',
            ]
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'role' => 'required|in:Customer,Worker',
            'email' => 'required|email',
            'password' => 'required|min:8|max:100',
        ]);
        $role = $request->input('role');
        if($role=='Customer')
        {
            $user= Customer::where('email', $request->email)->first();

            if(!$user){
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ]);
            }
            if(!Hash::check($request->input('password'), $user->password)){
              return response()->json([
                  'success' => false,
                  'message' => 'Incorrect password',
              ]);
            }
            $token=Auth::login($user);
            return response()->json([
                'success' => true,
                'message' => 'Login successfully',
                'authorization' => [
                    'token' => $token,
                    'token_type' => 'bearer',
                ]
            ]);
        }
        else{
            $user=Worker::where('email', $request->email)->first();

            if(!$user){
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ]);
            }
            if(!Hash::check($request->input('password'), $user->password)){
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password',
                ]);
            }
            $token=Auth::login($user);
            return response()->json([
                'success' => true,
                'message' => 'Login successfully',
                'authorization' => [
                    'token' => $token,
                    'token_type' => 'bearer',
                ]
            ]);
        }

    }

    public function logout()
    {

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No authenticated user found.'
            ], 401);
        }
        $guard = $user->role === 'Worker' ? 'worker' : 'customer';

        Auth::guard($guard)->logout();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful as ' . $user->role,
        ]);
    }
    public function refresh()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No authenticated user found.'
            ]);
        }
        else{
            $token=Auth::login($user);
            return response()->json([
                'success' => true,
                'message' => 'Login successfully',
                'authorization' => [
                    'token' => $token,
                    'token_type' => 'bearer',
                ]
            ]);
        }


    }


}


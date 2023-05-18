<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/get-users', function(){

    return User::get(['id', 'image'])->each(function($data){
        $temp[] = 'http://127.0.0.1:8000/storage/'.$data->image;
        return $data->image = $temp;
    });

});


Route::post('/get-user', function(Request $request){
    // return $request->ids;
    return User::whereIn('id', $request->ids)->get();
});
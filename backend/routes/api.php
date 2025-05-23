<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GroupController;



Route::post('/register', [AuthController::class, 'register'])->name('user.register');
Route::post('/login', [AuthController::class, 'login'])->name('user.login');


Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/logout', [AuthController::class, 'logout'])->name('user.logout');


    Route::get('/dashboard',[DashboardController::class, 'index'])->name('dashboard.index');

    
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::post('/groups/{id}', [GroupController::class, 'update'])->name('groups.update'); 
    Route::delete('/groups/{id}', [GroupController::class, 'destroy'])->name('groups.destroy');


    Route::get('/expenses',[ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/expenses',[ExpenseController::class, 'store'])->name('expenses.store');
    Route::post('/expenses/{id}',[ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{id}',[ExpenseController::class, 'destroy'])->name('expenses.destroy');

    Route::get('/expenses/export', [ExpenseController::class, 'exportCsv'])->name('expenses.export');
    Route::get('/expenses/export-pdf', [ExpenseController::class, 'exportPdf'])->name('expenses.export-pdf');
});
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->integer('price')->unsigned()->index();
            $table->foreignId('category_id')->constrained('categories');
            $table->integer('stock')->default(0)->unsigned();
            $table->timestamps();

            $table->index(['category_id', 'price']);
            $table->index(['category_id', 'price', 'title']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

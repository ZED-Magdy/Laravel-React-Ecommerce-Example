<?php

namespace App\Http\Requests\Catelog;

use Illuminate\Foundation\Http\FormRequest;

class ProductFilterRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'nullable|integer|exists:categories,id',
            'price_min' => 'nullable|integer|min:0',
            'price_max' => 'nullable|integer|min:1',
            'search' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Get the validated data from the request, ensuring all expected keys are present.
     *
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): mixed
    {
        $validated = parent::validated($key, $default);

        // If a specific key was requested, return that
        if ($key !== null) {
            return $validated;
        }

        // Ensure all expected keys are present with null values if not provided
        return array_merge([
            'category_id' => null,
            'price_min' => null,
            'price_max' => null,
            'search' => null,
        ], $validated);
    }
}

<?php

declare(strict_types=1);

return [
    'shipping_in_cents' => (int) env('ORDER_SHIPPING_IN_CENTS', 1500),
    'tax_rate' => (float) env('ORDER_TAX_RATE', 15),
];

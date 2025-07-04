<?php

declare(strict_types=1);

test('the application returns a successful response', function () {
    $testResponse = $this->get('/');

    $testResponse->assertStatus(200);
});

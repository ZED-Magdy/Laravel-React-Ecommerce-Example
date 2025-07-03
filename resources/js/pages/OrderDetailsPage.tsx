import React from 'react';
import { useParams } from 'react-router-dom';

export const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order #{orderId}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Order Date:</span>
                <span className="ml-2">March 7, 2024</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Delivered
                </span>
              </div>
              <div>
                <span className="font-medium">Total:</span>
                <span className="ml-2">$199.99</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">John Doe</span>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <span className="ml-2">123 Main St, City, Country</span>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <span className="ml-2">+1 234 567 890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Product 1</td>
                  <td className="px-6 py-4 whitespace-nowrap">2</td>
                  <td className="px-6 py-4 whitespace-nowrap">$49.99</td>
                  <td className="px-6 py-4 whitespace-nowrap">$99.98</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Product 2</td>
                  <td className="px-6 py-4 whitespace-nowrap">1</td>
                  <td className="px-6 py-4 whitespace-nowrap">$99.99</td>
                  <td className="px-6 py-4 whitespace-nowrap">$99.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';

export const ProductsListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example product cards */}
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={`https://picsum.photos/400/300?random=${id}`}
                alt={`Product ${id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Product {id}</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${(19.99 * id).toFixed(2)}</span>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
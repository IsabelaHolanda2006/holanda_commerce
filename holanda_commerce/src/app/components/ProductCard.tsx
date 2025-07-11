'use client';

import Image from 'next/image';
import UseFetching from '../hooks/UseFetching';
import { useEffect, useState } from 'react';
import { Product } from '../interfaces/Product';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Wishlist = {
  product_id: string;
  user_id: string;
};

interface ProductCardProps {
  product: Product | null;
  width?: string;
  height?: string;
}

export default function ProductCard({ product, width = 'w-64', height = 'h-80' }: ProductCardProps) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<boolean>(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && product) {
      async function fetchWishlist() {
        try {
          const response = await UseFetching<Wishlist[]>(
            `http://localhost:8000/read/products_in_wishlist/${user!.id}`
          );

          if (response.error) {
            console.error('Error fetching wishlist:', response.error);
            return;
          }

          if (response.data) {
            const wishlistArray = Array.isArray(response.data) ? response.data : [];
            setWishlist(wishlistArray.some((item: Wishlist) => item.product_id === product!.id));
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }

      fetchWishlist();
    }
  }, [user, product]);

  function handleProductClick() {
    router.push(`/pages/products/${product?.id}`);
  }

  async function toggleWishlist(productId: string) {
    if (!user) {
      router.push('/pages/login');
      return;
    }

    if (isWishlistLoading) return;

    try {
      setIsWishlistLoading(true);

      const response = await UseFetching<Wishlist[]>(
        `http://localhost:8000/read/products_in_wishlist/${user.id}`
      );

      if (response.error) {
        console.error('Error fetching wishlist:', response.error);
        return;
      }

      const wishlistData = response.data || [];
      const isInWishlist = wishlistData.some((item: Wishlist) => item.product_id === productId);

      if (!isInWishlist) {
        const addResponse = await UseFetching(
          `http://localhost:8000/create/products_in_wishlist`,
          {
            method: 'POST',
            body: {
              product_id: productId,
              user_id: user.id
            }
          }
        );

        if (addResponse.error) {
          console.error('Error adding to wishlist:', addResponse.error);
          return;
        }

        setWishlist(true);
      } else {
        const removeResponse = await UseFetching(
          `http://localhost:8000/delete/products_in_wishlist`,
          {
            method: 'DELETE',
            body: {
              product_id: productId,
              user_id: user.id
            }
          }
        );

        if (removeResponse.error) {
          console.error('Error removing from wishlist:', removeResponse.error);
          return;
        }

        setWishlist(false);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  }

  if (!product) {
    return (
      <div className='flex gap-6'>
          <div
            className={`bg-gray-200 rounded-lg relative shadow-md p-4 flex flex-col items-center ${width} ${height}`}
          >
            <div className='w-full h-40 flex items-center justify-center mb-4 bg-gray-300 rounded animate-pulse' />
            <div className='w-3/4 h-4 bg-gray-300 rounded animate-pulse mb-2' />
            <div className='w-1/2 h-6 bg-gray-300 rounded animate-pulse' />
          </div>
      </div>
    );
  }

    return (
      <div className='flex gap-6'>
        <div
              key={product.id}
              className={`bg-gray-200 rounded-lg relative shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow ${width} ${height} cursor-pointer duration-300`}
              tabIndex={0}
              onClick={handleProductClick}
              role='button'
              aria-label={`Product: ${product.name}`}
            >

              {/* Toggle Wishlist */}
              <button
                type='button'
                role='button'
                aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className='absolute top-0 left-0 m-2 p-1 rounded-full focus:outline-none hover:cursor-pointer focus:ring-2 focus:ring-blue-700 bg-gray-200 hover:bg-gray-300 transition-colors z-10 disabled:opacity-50'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                disabled={isWishlistLoading}
              >
                <Heart
                  className={`w-6 h-6 ${wishlist ? 'fill-blue-700 text-blue-700' : 'text-gray-400'} transition-colors`}
                  strokeWidth={2}
                  fill={wishlist ? 'currentColor' : 'none'}
                  aria-hidden='true'
                />
              </button>

              {/* Discount Badge */}
              {typeof product.discount_percentage === 'number' && product.discount_percentage > 0 && (
                <span className='bg-blue-700 text-gray-100 text-xs px-2 z-10 py-0.5 rounded absolute top-0 right-0 m-1'>
                  -{product.discount_percentage}%
                </span>
              )}
              
              {/* Product Image */}
              <div className='w-full h-40 flex items-center justify-center mb-4 bg-gray-400 rounded relative'>
                <Image
                  src={product.image_url ?? '/holanda-commerce.png'}
                  alt={product.name}
                  fill
                  sizes='256px'
                  className='object-cover relative'
                />
              </div>

              {/* Product Name */}
              <span
                className='block text-gray-800 font-semibold text-sm w-full text-center break-words leading-tight min-h-5 max-h-16 truncate'
                style={{ display: 'block', wordBreak: 'break-word' }}
                title={product.name}
              >
                {product.name}
              </span>

              {/* Product Price */}
              <div className='flex flex-col items-center mt-2 w-full'>
                {product.discount_percentage ? (
                  <>
                    <span className='text-gray-400 line-through text-sm whitespace-nowrap'>
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                    <span className='text-blue-700 font-bold text-xl whitespace-nowrap'>
                      R$ {(Number(product.price) * (1 - Number(product.discount_percentage) / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='invisible text-sm whitespace-nowrap'>placeholder</span>
                    <span className='text-blue-700 font-bold text-xl whitespace-nowrap'>
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
          </div>
      </div>
  );
}
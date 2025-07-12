'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Calendar, Package, Tag, ArrowLeft } from 'lucide-react';
import { Product } from '../../../interfaces/Product';
import { useAuth } from '../../../contexts/AuthContext';
import UseFetching from '../../../hooks/UseFetching';
import Link from 'next/link';
import { ProductsOnWishlist } from '@/app/interfaces/ProductsOnWishlist';
import NavBar from '@/app/components/NavBar';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;

      try {
        setIsLoading(true);
        const response = await UseFetching<Product>(
          `/read/products/id/${params.id}`
        );

        if (response.error) {
          console.error('Error fetching product:', response.error);
          return;
        }

        if (response.data) {
          console.log('Product data received:', response.data);
          const productData = Array.isArray(response.data) ? response.data[0] : response.data;
          console.log('Processed product data:', productData);
          
          const mappedProduct = {
            ...productData,
            price: Number(productData.price) || 0,
            discount_percentage: Number(productData.discount_percentage || productData.discountPercentage || 0),
            stock: Number(productData.stock) || 0,
            image_url: productData.image_url || productData.imageUrl || null,
            category_name: productData.category_name || productData.categoryName || null
          };
          
          console.log('Mapped product data:', mappedProduct);
          setProduct(mappedProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (user && product) {
      async function checkWishlist() {
        try {
          const response = await UseFetching<ProductsOnWishlist[]>(
            `/read/products_in_wishlist/${user!.id}`
          );

          if (response.error) {
            console.error('Error checking wishlist:', response.error);
            return;
          }

          if (response.data) {
            const wishlistArray = Array.isArray(response.data) ? response.data : [];
            setIsWishlist(wishlistArray.some((item: ProductsOnWishlist) => item.product_id === product!.id));
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }

      checkWishlist();
    }
  }, [user, product]);

  async function toggleWishlist() {
    if (!user) {
      router.push('/pages/login');
      return;
    }

    if (!product || isWishlistLoading) return;

    try {
      setIsWishlistLoading(true);

      if (!isWishlist) {
        const response = await UseFetching(
          `/create/products_in_wishlist`,
          {
            method: 'POST',
            body: {
              product_id: product.id,
              user_id: user.id
            }
          }
        );

        if (response.error) {
          console.error('Error adding to wishlist:', response.error);
          return;
        }

        setIsWishlist(true);
      } else {
        const response = await UseFetching(
          `/delete/products_in_wishlist/${user.id}/${product.id}`,
          {
            method: 'DELETE'
          }
        );

        if (response.error) {
          console.error('Error removing from wishlist:', response.error);
          return;
        }

        setIsWishlist(false);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  }

  async function addToCart() {
    if (!user) {
      router.push('/pages/login');
      return;
    }

    if (!product || isAddingToCart) return;

    try {
      setIsAddingToCart(true);

      const cartResponse = await UseFetching(
        `/read/shopping_cart/${user.id}`
      );

      if (cartResponse.error) {
        console.error('Error to find cart:', cartResponse.error);
        return;
      }

      const cartItems = Array.isArray(cartResponse.data) ? cartResponse.data : [];
      const alreadyInCart = cartItems.some(
        (item) => item.product_id === product.id
      );

      if (alreadyInCart) {
        const removeResponse = await UseFetching(
          `/delete/shopping_cart/${user.id}/${product.id}`,
          {
            method: 'DELETE'
          }
        );

        if (removeResponse.error) {
          console.error('Error to remove from the cart:', removeResponse.error);
          return;
        }

        alert('Product removed from cart!');
      } else {
        const addResponse = await UseFetching(
          `/create/shopping_cart`,
          {
            method: 'POST',
            body: {
              user_id: user.id,
              product_id: product.id,
              quantity: quantity
            }
          }
        );
        if (addResponse.error) {
          console.error('Error to add to cart:', addResponse.error);
          return;
        }

        alert('Product added to cart!');
      }
    } catch (error) {
      console.error('Error to update cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function calculateDiscountedPrice(price: number, discount: number) {
    const numPrice = Number(price) || 0;
    const numDiscount = Number(discount) || 0;
    if (!numPrice || !numDiscount) return numPrice;
    return numPrice * (1 - numDiscount / 100);
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100'>
        <div className='container mx-auto px-4 py-8'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-300 rounded w-1/4 mb-8' />
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='h-96 bg-gray-300 rounded' />
              <div className='space-y-4'>
                <div className='h-8 bg-gray-300 rounded w-3/4' />
                <div className='h-6 bg-gray-300 rounded w-1/2' />
                <div className='h-4 bg-gray-300 rounded w-full' />
                <div className='h-4 bg-gray-300 rounded w-2/3' />
                <div className='h-12 bg-gray-300 rounded w-1/3' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>Product not found</h1>
          <Link 
            href='/'
            className='inline-flex items-center gap-2 bg-blue-700 text-gray-100 px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            Back to main page
          </Link>
        </div>
      </div>
    );
  }

  console.log('Rendering product:', {
    name: product.name,
    image_url: product.image_url,
    hasImage: !!product.image_url,
    hasName: !!product.name
  });

  return (
    <div className='min-h-screen bg-gray-100'>
      <NavBar />

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          {/* Product Image */}
          <div className='relative'>
            <div className='aspect-square bg-gray-400 rounded-lg overflow-hidden relative'>
              {product.image_url ? (
                <Image
                  src={product.image_url || '/holanda-commerce.png'}
                  alt={product.name || 'Product image'}
                  fill
                  sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-cover'
                  priority
                  onError={(e) => {
                    console.error('Image failed to load:', product.image_url);
                    const target = e.target as HTMLImageElement;
                    target.src = '/holanda-commerce.png';
                  }}
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gray-300'>
                  <span className='text-gray-600 text-lg'>No image available</span>
                </div>
              )}
            </div>
            
            {/* Discount Badge */}
            {product.discount_percentage > 0 && (
              <div className='absolute top-4 left-4 bg-blue-700 text-gray-100 px-3 py-1 rounded-full text-sm font-semibold'>
                -{product.discount_percentage}%
              </div>
            )}

            {/* Stock Status */}
            <div className='absolute top-4 right-4'>
              {product.stock > 0 ? (
                <span className='bg-green-600 text-gray-100 px-3 py-1 rounded-full text-sm font-semibold'>
                  in stock
                </span>
              ) : (
                <span className='bg-red-600 text-gray-100 px-3 py-1 rounded-full text-sm font-semibold'>
                  out of stock
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>
                {product.name}
              </h1>
              
              {product.category_name && (
                <p className='text-gray-600 mb-4'>
                  Category: <span className='font-medium'>{product.category_name}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className='space-y-2'>
              {product.discount_percentage > 0 ? (
                <>
                  <p className='text-2xl text-gray-400 line-through'>
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className='text-4xl font-bold text-blue-700'>
                    R$ {calculateDiscountedPrice(product.price, product.discount_percentage).toFixed(2)}
                  </p>
                  <p className='text-green-600 font-semibold'>
                    Economy of R$ {(product.price - calculateDiscountedPrice(product.price, product.discount_percentage)).toFixed(2)}
                  </p>
                </>
              ) : (
                <p className='text-4xl font-bold text-blue-700'>
                  R$ {product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Info - todo: make the stock system fully functional, make it decrease and increase depending on action */}
            {/* <div className='flex items-center gap-2 text-gray-600'>
              <Package className='w-5 h-5' />
              <span>
                {product.stock > 0 
                  ? `${product.stock} unities available`
                  : 'Unavailable product'
                }
              </span>
            </div> */}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-gray-800'>Product information</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {product.fabrication_date && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Calendar className='w-5 h-5' />
                    <span>made on: {formatDate(product.fabrication_date)}</span>
                  </div>
                )}
                {product.expiration_date && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Calendar className='w-5 h-5' />
                    <span>expiration: {formatDate(product.expiration_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='space-y-4'>
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className='flex items-center gap-4 max-sm:flex-col'>
                  <label htmlFor='quantity' className='text-gray-800 font-medium'>
                    Quantity:
                  </label>
                  <div className='flex items-center border border-gray-300 rounded-lg'>
                    <button
                      type='button'
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-l-lg'
                      aria-label='Decrease quantity'
                    >
                      -
                    </button>
                    <input
                      type='number'
                      id='quantity'
                      min='1'
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className='w-16 text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700'
                      aria-label='Quantity'
                    />
                    <button
                      type='button'
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className='px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-r-lg'
                      aria-label='Increase quantity'
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  type='button'
                  onClick={addToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className='flex-1 flex items-center max-w-96 cursor-pointer justify-center gap-2 bg-blue-700 text-gray-100 px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2'
                >
                  {/* Todo: make 'removing...' : 'remove to kart' */}
                  <ShoppingCart className='w-5 h-5' />
                  {isAddingToCart ? 'Adding...' : 'Add to cart'}
                </button>

                <button
                  type='button'
                  onClick={toggleWishlist}
                  disabled={isWishlistLoading}
                  className='flex items-center justify-center gap-2 bg-gray-200 cursor-pointer text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2'
                  aria-label={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    strokeWidth={2}
                  />
                  {isWishlistLoading ? '...' : (isWishlist ? 'Wishlisted' : 'Wishlist')}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className='border-t border-gray-200 pt-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <Package className='w-4 h-4' />
                  <span>Fast delivery</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Tag className='w-4 h-4' />
                  <span>Best price guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

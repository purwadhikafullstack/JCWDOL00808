import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function CartButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartsData, setCartsData] = useState([
    {
      id: 1,
      quantity: 2,
      createdAt: "2023-03-20T14:22:16.000Z",
      updatedAt: "2023-03-20T14:22:16.000Z",
      users_id: "75c451bb-c187-4bfe-baa4-c783e761a5f0",
      products_id: 1,
      product: {
        id: 1,
        name: "Baju hitam motif bunga",
        description:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias nihil vel, quos dicta vitae eius quidem sunt voluptate magnam, pariatur repellendus nam eos ipsum officia debitis quia minus perspiciatis placeat!",
        price: 50000,
        weight: 500,
        imageUrl: "public\\imageUrl\\PIMG-1679037303463184322791.png",
        createdAt: "2023-03-09T04:46:42.000Z",
        updatedAt: "2023-03-09T04:46:42.000Z",
        product_categories_id: 1,
      },
    },
    {
      id: 2,
      quantity: 50,
      createdAt: "2023-03-20T14:22:16.000Z",
      updatedAt: "2023-03-24T16:37:39.000Z",
      users_id: "75c451bb-c187-4bfe-baa4-c783e761a5f0",
      products_id: 2,
      product: {
        id: 2,
        name: "Baju biru putih",
        description:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias nihil vel, quos dicta vitae eius quidem sunt voluptate magnam, pariatur repellendus nam eos ipsum officia debitis quia minus perspiciatis placeat!",
        price: 75000,
        weight: 300,
        imageUrl: "public\\imageUrl\\PIMG-1679037303463184322792.png",
        createdAt: "2023-03-09T04:46:42.000Z",
        updatedAt: "2023-03-09T04:46:42.000Z",
        product_categories_id: 1,
      },
    },
  ]);
  const navigate = useNavigate();

  return (
    <div>
      <Link to="/user/cart">
        <FaShoppingCart
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          cursor="pointer"
          className="dark:text-white text-2xl hover:text-slate-300"
        />
      </Link>

      {isOpen && (
        <>
          {cartsData ? (
            cartsData.map((cart, index) => {
              return (
                <div
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                  key={index}
                  className="absolute top-5 right-16 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div>
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/${cart.product.imageUrl}`}
                      alt={cart.product.name}
                    />
                    <div className="py-1">
                      <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {cart.product.name}
                      </p>
                      <p>{cart.product.wight}</p>
                    </div>
                    <div>
                      <h4>
                        {(cart.product.price * cart.quantity).toLocaleString(
                          "id-ID",
                          { style: "currency", currency: "IDR" }
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="absolute top-0 right-0 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-1">
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add some products to cart
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartButton;

import { HTMLProps, useRef, useState } from "react"
import { FoodItem } from "./data/FoodItem"
import data from './data/data.json';
import { FaTimesCircle, FaTree } from "react-icons/fa";
import { BiCartAdd } from "react-icons/bi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

export interface FoodItemProps extends HTMLProps<HTMLDivElement> {
  foodItem: FoodItem
  onAdd: () => void
}

function App() {
  const foodItems = data as FoodItem[];

  const [cartItems, setCartItems] = useState(new Map<FoodItem, number>());

  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerDialogRef = useRef<HTMLDivElement>(null);

  const addItem = (item: FoodItem) => {
    // Create a new Map from the existing one to ensure immutability
    const newMap = new Map(cartItems);
  
    // Get the current quantity of the item, defaulting to 0 if not present
    const currentQuantity = newMap.get(item) ?? 0;
  
    // Update the quantity of the item in the new map
    newMap.set(item, currentQuantity + 1);
  
    // Update the state with the new map
    setCartItems(newMap);
  };

  const removeItem = (item: FoodItem) => {
    const newMap = new Map(cartItems);

    const currentQuantity = newMap.get(item) ?? 0;

    if(currentQuantity - 1 == 0){
      //Remove the entry
      newMap.delete(item);
    } else {
      newMap.set(item, currentQuantity - 1);
    }

    setCartItems(newMap);
  };

  const startNewOrder = () => {
    setCartItems(new Map<FoodItem, number>());
    closeDialog();
  }

  const openDialog = () => {
    dialogRef.current?.show();
  }

  const closeDialog = () => {
    dialogRef.current?.close();
  }

  const handleDialogClick = (e: React.MouseEvent) => {
    // Access the current DOM element from the ref
    const dialogElement = innerDialogRef.current;

    if (dialogElement && !dialogElement.contains(e.target as Node)) {
      closeDialog();
    }
  };

  return (
    <main className="md:flex md:flex-row">
      <dialog onClick={(e) => handleDialogClick(e)} ref={dialogRef} className="fixed w-full h-full z-10 bg-black/50">
        <div ref={innerDialogRef} className="flex flex-col gap-8 p-6 md:p-10 absolute w-5/6 h-5/6 md:w-1/4 md:h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl">
          <div className="flex flex-col gap-2">
            <h1 className="font-header font-bold text-4xl">Order Confirmed.</h1>
            <p className="font-base text-rose-500">We hope you enjoy your food!</p>
          </div>

          <div className="min-h-0 flex flex-col justify-between">
            {/* LIST OF ORDER ITEMS */}
            <div className="bg-rose-100 p-4 rounded-lg overflow-scroll">
              {
                Array.from(cartItems).map((item, index) => {
                  return (
                    <div key={index} className="flex flex-row border-b gap-10 py-4 w-full justify-between">
                      <div className="flex flex-col gap-2 w-full">
                        {/* ITEM NAME */}
                        <p className="font-base font-bold text-nowrap">{item[0].name}</p>

                        {/* PRICE DETAILS */}
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-4">
                            <p className="font-base text-amber-600 font-bold">{item[1]}x</p>
                            <p className="font-base">${(item[0].price).toFixed(2)} ea.</p>
                          </div>
                          <p className="font-base font-bold">${(item[1] * item[0].price).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>

            {/* TOTAL */}
            <div className="flex flex-row justify-between mt-4 items-center mb-4">
                <p className="font-base">Order Total</p>
                <p className="font-header font-bold text-2xl">${Array.from(cartItems).reduce((acc, it) => {return acc + it[0].price * it[1]}, 0).toFixed(2)}</p>
            </div>

            {/* NEW ORDER BUTTON */}
            <button onClick={() => startNewOrder()} className="w-full bg-food-red hover:scale-105 transition-all hover:shadow-md font-header text-white rounded-full px-4 py-2 text-2xl">Start New Order</button>
          </div>
        </div>
      </dialog>

      <div className="m-auto flex flex-col p-10 w-fit">
        <h1 className="font-header font-bold text-5xl mb-10">Desserts</h1>
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT SIDE FOR LIST */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl w-fit">
          {
            foodItems.map((fi, index) => {
              return (
                <div key={index} className="flex flex-col gap-8">
                  {/* IMAGE AND BUTTON */}
                  <div className="relative">
                    {!cartItems.get(fi) && <button 
                      onClick={() => addItem(fi)}
                      className="flex flex-row w-fit min-w-1/2 h-fit absolute justify-center -bottom-6 md:-bottom-4 bg-white border border-food-red left-1/2 -translate-x-1/2 rounded-full hover:scale-105 active:scale-100 transition-all items-center gap-2 text-md font-medium font-header text-nowrap">
                      <BiCartAdd size={20} className="text-food-red m-4 md:my-2"></BiCartAdd> <p className="mr-4">Add to Cart</p>
                    </button>}

                    {cartItems.get(fi)! > 0 && 
                      <div className="text-white w-1/2 justify-between absolute -bottom-6 md:-bottom-4 bg-food-red left-1/2 -translate-x-1/2 rounded-full hover:scale-105 active:scale-100 transition-all flex flex-row items-center gap-2 text-md font-medium font-header text-nowrap">
                        <button className="h-full md:p-2 p-4" onClick={() => removeItem(fi)}><CiCircleMinus strokeWidth={1} size={20}/></button>
                        <p>{cartItems.get(fi)}</p>
                        <button className="h-full md:p-2 p-4" onClick={() => addItem(fi)}><CiCirclePlus strokeWidth={1} size={20}/></button>
                      </div>
                    }

                    <img className={`rounded-lg min-w-0 ${cartItems.get(fi) ? 'ring-2 ring-food-red' : ''}`} src={fi.image.desktop} alt="" />
                  </div>

                  {/* Name n stuff */}
                  <div className="flex flex-col items-start">
                    <p className="text-sm text-rose-400 font-base">{fi.category}</p>
                    <p className="text-lg font-header font-medium">{fi.name}</p>
                    <p className="font-base text-amber-700">${fi.price.toFixed(2)}</p>
                  </div>
                </div>
              )
            })
          }
          </div>

          {/* RIGHT SIDE FOR CART */}
          <div className='bg-white flex flex-col px-8 py-4 pt-0 border border-rose-500 rounded-lg h-1/2 md:w-96'>
            <p className="font-header font-bold text-3xl mb-4 text-nowrap mt-4 text-food-red">Your Cart ({Array.from(cartItems).reduce((acc, item) => {return acc += item[1]}, 0)})</p>
            {
            cartItems.size > 0 && 
            <div className="flex flex-col">
              {
                Array.from(cartItems).map((item, index) => {
                  return (
                    <div key={index} className="flex flex-row border-b gap-10 py-4 w-full justify-between">
                      <div className="flex flex-col gap-2 w-full">
                        {/* ITEM NAME */}
                        <p className="font-base font-bold text-nowrap">{item[0].name}</p>

                        {/* PRICE DETAILS */}
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-4">
                            <p className="font-base text-amber-600 font-bold">{item[1]}x</p>
                            <p className="font-base">${(item[0].price).toFixed(2)} ea.</p>
                          </div>
                          <p className="font-base font-bold">${(item[1] * item[0].price).toFixed(2)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item[0])} className="text-rose-500 hover:text-rose-900 transition-all"><FaTimesCircle></FaTimesCircle></button>
                    </div>
                  )
                })
              }
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between mt-4 items-center">
                  <p className="font-base text-xl">Total</p>
                  <p className="font-header font-bold text-2xl">${Array.from(cartItems).reduce((acc, it) => {return acc + it[0].price * it[1]}, 0).toFixed(2)}</p>
                </div>
                <div className="rounded-lg flex flex-row items-center justify-center gap-2 px-4 py-2 bg-rose-100 font-base">
                  <FaTree className="text-food-green"></FaTree>
                  <span className="text-sm">This is a <b>carbon-neutral</b> delivery</span>
                </div>
                <button onClick={() => openDialog()} className="bg-food-red hover:scale-105 transition-all hover:shadow-md font-header text-white rounded-full px-4 py-2 text-2xl">Confirm Order</button>
              </div>
            </div>
            }

            {
            cartItems.size == 0 && 
            <div>
              <img src="./assets/images/illustration-empty-cart.svg" className="m-auto p-8"></img>
              <p className="font-base text-rose-500 text-center">Your added items will appear here.</p>
            </div>
            }
          </div>
        </div>
      </div>
    </main>
  )
}

export default App

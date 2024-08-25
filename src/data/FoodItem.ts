export interface FoodItem {
    image: {
        thumbnail: string,
        mobile: string,
        tablet: string,
        desktop: string
    },
    name: string,
    category: string,
    price: number
}
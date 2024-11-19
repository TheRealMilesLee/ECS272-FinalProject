import * as d3 from 'd3';

export let column_from_csv = await d3.csv('../Resources/car_data.csv', (d) =>
{
  // Filter out rows with any null or invalid values
  if (!d.car_brand || !d.car_model || !d.car_price || d.car_price == 0 ||
    !d.car_city || !d.car_fuel || !d.car_transmission || !d.car_drive ||
    !d.car_mileage || !d.car_country || !d.car_engine_capacity ||
    !d.car_engine_hp || !d.car_age)
  {
    return null;
  }
  return {
    brand: d.car_brand.trim(),
    model: d.car_model.trim(),
    price: +d.car_price, // Convert price to number
    city_sold: d.car_city.trim(),
    transmissio: d.car_transmission.trim(),
    mileage: +d.car_mileage, // Convert mileage to number
    engine_capacity: +d.car_engine_capacity, // Convert engine capacity to number
    age: +d.car_age // Convert age to number
  };
}).then(data =>
{
  // Filter out any remaining invalid entries
  return data.filter(d => d);
});

// Sort the data by car_price
column_from_csv.sort((a, b) => a.car_price - b.car_price);

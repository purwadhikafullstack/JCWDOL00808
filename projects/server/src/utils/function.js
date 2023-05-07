const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => (angle * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

const getCurrentWeek = () => {
  const currentDate = new Date();
  const weekStart = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
  const weekEnd = weekStart + 6;
  return [new Date(currentDate.setDate(weekStart)).toISOString().substring(0, 10), new Date(currentDate.setDate(weekEnd)).toISOString().substring(0, 10)];
};

const getCurrentMonth = () => {
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return [monthStart.toISOString().substring(0, 10), monthEnd.toISOString().substring(0, 10)];
};

module.exports = { haversineDistance, getCurrentWeek, getCurrentMonth };

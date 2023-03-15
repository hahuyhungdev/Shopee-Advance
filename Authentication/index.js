var twoSum = function (nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const another = target - nums[i];
    console.log(another);
    console.log('map[another]', map);
    if (another in map) {
      console.log('okee');
      return [map[another], i];
    }

    map[nums[i]] = i;
  }
  return null;
};
twoSum([2, 7, 11, 15], 9);

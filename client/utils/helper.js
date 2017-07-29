export default {
  getRandomHSLColor: () => {
    const hue = Math.round(360 * Math.random());
    const saturation = '100%';
    const lightness = '70%';

    return `hsl(${hue}, ${saturation}, ${lightness})`;
  },

  splitArrayIntoChunks: (array, chunksize) => {
    const chunkedArray = [];

    for (let i = 0; i < array.length; i += chunksize) {
      chunkedArray.push(array.slice(i, i + chunksize));
    }

    return chunkedArray;
  },
};

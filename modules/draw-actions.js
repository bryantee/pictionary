const someFunctions = {
  designateDrawer: function() {
    console.log(`userCount in draw-actions module: ${global.userCount}`);
    if (global.userCount === 1) {
      console.log('First user, you are the drawer this round.');
    } else {
      console.log('The drawer has already been designated. Happy guessing.');
    }
  }
}

module.exports = someFunctions;

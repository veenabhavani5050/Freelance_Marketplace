const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

console.log(getCurrentUser());
export default getCurrentUser;

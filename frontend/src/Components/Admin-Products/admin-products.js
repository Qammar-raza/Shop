import React, { useState, useEffect } from "react";
import Grid from "../Grid/grid";

const AdminProducts = (props) => {
  const [adminPosts, setAdminPosts] = useState([]);
  const [error, setError] = useState("");
  // const classes = useStyles();

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = () => {
    fetch("/admin/products", {
      method: "GET",

      headers: { Authorization: "Bearer " + props.token },
    })
      .then((res) => {
        if (res.status !== 200) {
          setError("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setAdminPosts(
          resData.products.map((p) => {
            return { ...p, imagePath: "/" + p.imageUrl };
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const deleteHandler = (productId) => {
    console.log("deleteHandler in Admin clicked on : ", productId);
    fetch("/product/admin/prod/" + productId, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + props.token },
    })
      .then((res) => {
        if (res.status !== 200 || res.status !== 201) {
          setError("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        loadUserPosts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid
      posts={adminPosts}
      delete={(productId) => deleteHandler(productId)}
      edit="true"
    />
  );
};

export default AdminProducts;

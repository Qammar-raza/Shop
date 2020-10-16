import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header, Segment, Image, Button } from "semantic-ui-react";

import "./SingleProduct.css";

const SingleProduct = (props) => {
  let history = useParams();
  const [product, setProduct] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    loadPost();
    // something();
  }, []);
  const loadPost = () => {
    const postId = history.productId;
    console.log(postId);
    fetch("/product/" + postId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          setError("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setProduct(resData.product);
      })
      .catch((err) => console.log(err));
  };
  // return <p>something</p>;

  return product ? (
    <Segment>
      <Header>
        <h1> Title : </h1>
        <Header.Subheader className="product-title">
          <h1>{product.title}</h1>
        </Header.Subheader>
      </Header>
      <Image src={"/" + product.imageUrl} size="huge" fluid centered />

      <Header>
        <h1>Price : </h1>
        <Header.Subheader className="product-price">
          <h1>{product.price} $</h1>
        </Header.Subheader>
      </Header>

      <Header>
        <h1>Description : </h1>
        <Header.Subheader className="product-description">
          <h1>{product.description}</h1>
        </Header.Subheader>
      </Header>
      <Button
        content="Add to cart"
        size="medium"
        color="linkedin"
        fluid
        icon="cart"
        labelPosition="left"
      />
    </Segment>
  ) : null;
};

export default SingleProduct;

import React, { useState, useEffect } from "react";
import {
  Form,
  Icon,
  Button,
  Input,
  Label,
  TextArea,
  Grid,
} from "semantic-ui-react";
import { useParams, useHistory } from "react-router-dom";
import FilePicker from "../FilePicker/FilePicker";

const EditForm = (props) => {
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState("");
  const [product, setProduct] = useState({});
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreveiw] = useState(null);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadEditForm();
  }, []);
  const inputChangeHandler = (event) => {
    if (event.target.name === "title") {
      setTitle(event.target.value);
    }
    if (event.target.name === "price") {
      setPrice(event.target.value);
    }
    if (event.target.name === "description") {
      setDescription(event.target.value);
    }
  };

  const postInputChangeHandler = (input, value, files) => {
    if (files) {
      setImagePreveiw(files[0]);
    }
  };

  const loadEditForm = () => {
    const postId = params.productId;
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
        setTitle(resData.product.title);
        setPrice(resData.product.price);
        setDescription(resData.product.description);
        setImagePreveiw(resData.product.imageUrl);
        console.log(imagePreview);
      })
      .catch((err) => console.log(err));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("imageUrl", imagePreview ? imagePreview : product.imageUrl);
    // formData.append("role", role);

    if (!props.token) {
      console.log("Form cant be submitted");
      return;
    }
    fetch("/product/prod/" + product._id, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        console.log(res);
        history.push({ pathname: "/" });
        console.log("pushing to home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid textAlign="center" className="center">
      <Grid.Column style={{ maxWidth: 600, marginTop: "2rem" }}>
        <Form>
          <Form.Field>
            <h3>Title of Product</h3>
            <Input
              id="title"
              fluid
              icon="users"
              iconPosition="left"
              name="title"
              placeholder="Problem Title"
              value={title}
              onChange={inputChangeHandler}
            />
          </Form.Field>
          <Form.Field>
            <h3>Choose the image</h3>
            <FilePicker
              id="image"
              control="input"
              //   val={imagePreview}
              onChange={postInputChangeHandler}
            />
          </Form.Field>
          <Form.Field>
            <h3>Price of Product</h3>
            <Input
              fluid
              id="price"
              name="price"
              value={price}
              labelPosition="right"
              type="Number"
              placeholder="Amount"
              onChange={inputChangeHandler}
            >
              <Label basic>$</Label>
              <input />
              <Label>.00</Label>
            </Input>
          </Form.Field>
          <Form.Field>
            <h3>Product Description</h3>
            <TextArea
              name="description"
              value={description}
              style={{ minHeight: 100 }}
              onChange={inputChangeHandler}
            />
          </Form.Field>
        </Form>
        <Button
          color="purple"
          style={{ marginTop: "1rem" }}
          inverted
          onClick={(e) => submitHandler(e)}
        >
          <Icon name="checkmark" />
          Update Product
        </Button>
      </Grid.Column>
    </Grid>
  );
};

export default EditForm;

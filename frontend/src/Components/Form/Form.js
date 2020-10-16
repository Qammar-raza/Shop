import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Form.css";
import {
  Form,
  Icon,
  Button,
  Input,
  Label,
  TextArea,
  Grid,
} from "semantic-ui-react";
// import { Grid } from "semantic-ui-react";
import EditForm from "../Edit-Form/editForm";
import FilePicker from "../FilePicker/FilePicker";

const Forms = (props) => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreveiw] = useState(null);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("Admin");

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
      // TO SET AN IMAGE PREVEIW    TO SET AN IMAGE PREVEIW   TO SET AN IMAGE PREVEIW   TO SET AN IMAGE PREVEIW   TO SET AN IMAGE PREVEIW
      // generateBase64FromImage(files[0])
      //   .then((b64) => {
      //     setImagePreveiw(b64);
      //   })
      //   .catch((e) => {
      //     setImagePreveiw(null);
      //   });
    }
  };

  const submitHandler = (e) => {
    // const history = useHistory();
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("imageUrl", imagePreview);
    formData.append("role", role);

    if (!props.token) {
      console.log("Form cant be submitted");
      return;
    }
    fetch("/product/prod", {
      method: "POST",
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
    // <EditForm
    //   submit={(e) => submitHandler(e)}
    //   input={(e) => inputChangeHandler(e)}
    // />

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
              onChange={inputChangeHandler}
            />
          </Form.Field>
          <Form.Field>
            <h3>Choose the image</h3>
            <FilePicker
              id="image"
              // label="image"
              control="input"
              onChange={postInputChangeHandler}
            />
          </Form.Field>
          <Form.Field>
            <h3>Price of Product</h3>
            <Input
              fluid
              id="price"
              name="price"
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
          Add Product
        </Button>
      </Grid.Column>
    </Grid>
  );
};

export default Forms;

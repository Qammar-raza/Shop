import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles({
  root1: {
    flexGrow: 1,
  },
  root2: {
    maxWidth: 333,
    margin: "2rem auto",
  },
  media: {
    height: 140,
  },
});

const Shop = (props) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Admin");
  const { token } = props;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    console.log(token);
    fetch("/product/getProducts", {
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
        setPosts(
          resData.products.map((p) => {
            return { ...p, imagePath: "/" + p.imageUrl };
          })
        );
        console.log(posts);
      })
      .catch(() => {
        console.log(error);
      });
  };

  const deleteHandler = (productId) => {
    console.log("Delete Handler Clicked ", productId);
    // console.log("Token : ", props.token);
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
        loadPosts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();

  return (
    <Grid container className={classes.root1}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={6}>
          {posts.map((p) => (
            <Grid key={p._id} item>
              <Card
                className={classes.root2}
                // onClick={(e) => cardDetails(e, p._id)}
              >
                <CardActionArea>
                  <Link to={p._id}>
                    <CardMedia image={p.imagePath} className={classes.media} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {p.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {p.description}
                      </Typography>
                    </CardContent>
                  </Link>

                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      // onClick={() => cardClicked(p._id, "deleteClick")}
                      onClick={() => deleteHandler(p._id)}
                    >
                      Delete
                    </Button>
                    <Button size="small" color="primary">
                      <Link to={p._id}>Details</Link>
                    </Button>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Shop;

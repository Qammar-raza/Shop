const { roles } = require("../Access-Controller/access-controller");
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("User").readAny("Post");
ac.grant("Admin").createAny("Post").deleteAny("Post");

exports.grantAccess = (action, resource, role) => {
  return (req, res, next) => {
    try {
      let permission;

      if (action === "createAny") {
        console.log("in createAny");
        permission = ac.can(req.body.role).createAny("Post");
      } else if (action === "deleteAny") {
        console.log("in deleteAny");
        permission = ac.can(role).deleteAny("Post");
      }
      let error;
      if (!permission.granted) {
        console.log(permission.granted);
        error = new Error(
          "You don't have enough permission to perform this action"
        );
        error.statusCode = 401;

        // throw error;
      }
      next(error);
    } catch (error) {
      next(error);
      // throw error;
    }
  };
};

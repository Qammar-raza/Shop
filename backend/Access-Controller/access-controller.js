const AccessControl = require("accesscontrol");
// const ac = new AccessControl(grants);
const ac = new AccessControl();

// ac.grants("Admin").readAny("Post").createAny("Post");

exports.roles = () => {
  ac.grant("User").deny.readAny("Post");
  ac.grant("Admin")
    .extend("User")
    .createAny("Post")
    .updateAny("Post")
    .deleteAny("Post");
  return ac;
};

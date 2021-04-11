import React, {useState} from "react";
import cx from "classnames";
import Inspector from "./Inspector";

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container" >
      <div className={cx("main", {"open": open})} >
        <h1>here is the code</h1>
      </div>
      <div className="bottomDrawer">
        <Inspector open={open} toggleOpen={()=>setOpen(prevState => !prevState)} />
      </div>
    </div>
  );
};

export default App;

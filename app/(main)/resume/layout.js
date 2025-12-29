import React, { Suspense } from "react";
import { GridLoader } from "react-spinners";

const Layout = ({ children }) => {
    return (
        <div className="px-1 mt-25">
            {/*Suspense component means that if the content inside children is not ready yet(because we will be generating/fetching),
            show this fallback UI instead. */}
            <Suspense fallback={
                <div className="flex h-[60vh] items-center justify-center">
                    <GridLoader color="#a855f7" size={15}/>
                </div>
            }>{children}</Suspense>
        </div>
    );
}

export default Layout;
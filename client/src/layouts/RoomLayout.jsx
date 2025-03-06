import { Outlet } from "react-router";

const NewLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="h-[5vh] min-h-[40px] bg-gray-800 flex justify-between items-center px-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-bold">Table Name</h1>
      </header>

      {/* Middle section with background and table design */}
      <div className="h-[80vh] flex-1 relative flex items-center justify-center p-2 overflow-hidden">
        <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center py-2">
          <div className="relative w-full aspect-[1.7/1] mx-auto">
            {/* Main table - this is now part of the layout */}
            <div className="absolute inset-0 bg-green-800 rounded-[45%] border-4 md:border-8 border-amber-900 shadow-xl flex items-center justify-center">
              {/* Inner felt */}
              <div className="absolute inset-[5%] bg-green-700 rounded-[40%]">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLayout;

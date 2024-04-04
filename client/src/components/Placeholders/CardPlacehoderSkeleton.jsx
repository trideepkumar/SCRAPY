export default function CardPlacehoderSkeleton() {
    return (
      <>
        <div className="w-full flex items-center flex-col bg-gray-700 rounded-lg">
          <div className="flex flex-col bg-gray-700 shadow-md rounded-md items-center">
            <div className="flex items-center p-2"> {/* Reduce padding */}
              <div className="mr-2 h-6 w-8 rounded-full overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
              <div className="flex flex-col justify-between items-center">
                <div className="mb-1 h-3 w-20 overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
              </div>
            </div>
            <div className="h-28 w-full overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce height */}
            <div className="flex flex-col p-2"> {/* Reduce padding */}
              <div className="flex">
                <div className="flex h-3 w-3 overflow-hidden relative bg-gray-500 mr-1 placeholder"></div> {/* Reduce size */}
                <div className="flex h-3 w-24 overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
              </div>
              <div className="flex mt-1">
                <div className="flex h-3 w-3 overflow-hidden relative bg-gray-500 mr-1 placeholder"></div> {/* Reduce size */}
                <div className="flex h-3 w-24 overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
              </div>
            </div>
            <div className="w-full h-px overflow-hidden relative bg-gray-500 m-2 placeholder"></div> {/* Reduce padding */}
            <div className="flex justify-between items-center p-2 w-full"> {/* Reduce padding */}
              <div className="mr-2 h-5 w-8 overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
              <div className="mb-1 h-3 w-10 overflow-hidden relative bg-gray-500 placeholder"></div> {/* Reduce size */}
            </div>
          </div>
        </div>
  
        <style>
          {`
            .placeholder::after {
              content: " ";
              box-shadow: 0 0 25px 5px rgba(254, 254, 254); /* Adjust shadow size */
              position: absolute;
              top: 0;
              left: -100%;
              height: 90%;
              animation: load 0.7s infinite;
            }
  
            @keyframes load {
              0% {
                left: -100%;
              }
              100% {
                left: 150%;
              }
            }
          `}
        </style>
      </>
    );
  }
  
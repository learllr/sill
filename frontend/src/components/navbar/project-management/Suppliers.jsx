import Body from "../../common/Body";

export default function Suppliers() {
  return (
    <Body>
      <div className="bg-gray-100">
        <div className="flex justify-center items-center mt-10">
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">
              Fournisseurs
            </h1>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Enregistrer les paramètres
            </button>
          </div>
        </div>
      </div>
    </Body>
  );
}

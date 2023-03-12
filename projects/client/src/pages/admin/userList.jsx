import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getUsers();
  }, [page, keyword]);

  const getUsers = async () => {
    const response = await axios.get(`http://localhost:8000/admin/getAdminUserList?search_query=${keyword}&page=${page}&limit=${limit}`);
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg("Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!");
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  return (
    <div class="container mx-auto mt-5 ">
      <div class="grid grid-cols-5 md:grid-cols-2">
        <div class="mx-4">
          <form onSubmit={searchData}>
            <div class="flex justify-center my-2">
              <div class="relative mr-2">
                <input type="text" class="h-10 w-96 pl-3 pr-8 rounded-lg z-0 border-2 focus:shadow focus:outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                <div class=" top-0 right-0 mt-3 mr-2">
                  <button type="submit" class="bg-dark-purple hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
          <table class=" w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">No</th>
                <th class="py-3 px-6 text-left">Name</th>
                <th class="py-3 px-6 text-left">Email</th>
                <th class="py-3 px-6 text-left">Phone Number</th>
                <th class="py-3 px-6 text-left">Verification Status</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td class="py-3 px-6 text-left">{index + 1}</td>
                  <td class="py-3 px-6 text-left">{user.full_name}</td>
                  <td class="py-3 px-6 text-left">{user.email}</td>
                  <td class="py-3 px-6 text-left">{user.phone_number}</td>
                  <td class="py-3 px-6 text-left">{user.is_verified ? "Verified" : "Not Verified"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="my-4">
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <p class="text-center text-red-600">{msg}</p>
          <nav class="flex items-center justify-center mt-4 mb-10" key={rows} role="navigation" aria-label="pagination">
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"flex"}
              pageLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
              previousLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
              nextLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
              activeLinkClassName={"mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
              disabledLinkClassName={"mx-2 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded"}
            />
            <Link to="/admin">
              <button class="bg-dark-purple hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserList;

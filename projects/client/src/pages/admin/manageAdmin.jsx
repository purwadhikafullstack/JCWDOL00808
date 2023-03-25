import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { API_url } from "../../helper";
import { useNavigate } from "react-router-dom"

const ManageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("DESC");

  useEffect(() => {
    // set here !
    getUsers();
  }, [page, keyword, sort, order]);

  const getUsers = async () => {
    const response = await axios.get(`http://localhost:8000/admin/getAdmin?search_query=${keyword}&page=${page}&limit=${limit}`, {
      params: {
        sort,
        order,
      },
    });
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };
  //blm dpet get query params

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg("Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!");
    } else {
      setMsg("");
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/admin/deleteAdmin/${id}`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  const handleOrder = (e) => {
    setOrder(e.target.value);
    setPage(0);
  };

  const navigate = useNavigate()

  return (
    <div class="container mx-auto mt-5">
      <div class="grid grid-cols-5 md:grid-cols-1">
        <div class="mx-4">
          <form onSubmit={searchData}>
            <div class="flex justify-center my-2">
              <div class="relative mr-2">
                <input type="text" class="h-10 w-96 pl-3 pr-8 rounded-lg z-0 border-2 focus:shadow focus:outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                <div class=" top-0 right-0 mt-3 mr-2">
                  <button type="submit" class="bg-dark-purple hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
          <form>
            <div className="flex items-center justify-between mb-4 md:mb-0">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2">
                  Sort by:
                </label>
                <select id="sort" name="sort" value={sort} onChange={handleSort} className="border border-gray-400 p-2 rounded-lg">
                  <option value="id">ID</option>
                  <option value="full_name">Full Name</option>
                  <option value="email">Email</option>
                  <option value="phone_number">Phone Number</option>
                </select>

                <label htmlFor="order" className="ml-2 mr-2">
                  Order:
                </label>
                <select id="order" name="order" value={order} onChange={handleOrder} className="border border-gray-400 p-2 rounded-lg mr-20">
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>

              <div className="flex items-center ml-auto">
                <Link to={"/admin/registeradmin"}>
                  <button
                    onClick={() => {
                      // logic to open a modal or redirect to a page to add data
                    }}
                    className="bg-dark-purple hover:bg-blue-700 text-white font-bold p-2 ml-6 rounded"
                  >
                    Add Admin
                  </button>
                </Link>
              </div>
            </div>
            <table class=" w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th class="py-3 px-6 text-left">No</th>
                  <th class="py-3 px-6 text-left">Name</th>
                  <th class="py-3 px-6 text-left">Email</th>
                  <th class="py-3 px-6 text-left">Phone Number</th>
                  <th class="py-3 px-6 text-left">Role Admin</th>
                  <th class="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td class="py-3 px-6 text-left">{index + 1}</td>
                    <td class="py-3 px-6 text-left">{user.full_name}</td>
                    <td class="py-3 px-6 text-left">{user.email}</td>
                    <td class="py-3 px-6 text-left">{user.phone_number}</td>
                    <td class="py-3 px-6 text-left">{user.role == 1 ? "Admin" : "Admin Warehouse"}</td>
                    <td class="py-3 px-6 text-left flex">
                      <Link to={`/admin/patch-admin/${user.id}`}>
                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                      </Link>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  onClick={() => navigate(`/admin/assign/${user.id}`)}>Assign</button>
                      <button
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this admin?")) {
                            deleteAdmin(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
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

export default ManageAdmin;

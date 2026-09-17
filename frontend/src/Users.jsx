import {
  Users as UsersIcon,
  ShieldCheck,
  UserRound,
  Search,
  RefreshCw
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import { getUsers } from "./api";


function Users() {

  const [
    users,
    setUsers
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);


  const loadUsers =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "civicai_token"
          );

        const data =
          await getUsers(
            token
          );

        setUsers(data);

      } catch (error) {

        console.error(
          "Failed to load users:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadUsers();

  }, []);


  const filtered =
    users.filter(
      (user) => {

        const text =
          search.toLowerCase();

        return (
          user.name
            ?.toLowerCase()
            .includes(text) ||
          user.email
            ?.toLowerCase()
            .includes(text)
        );
      }
    );


  return (

    <div className="space-y-5">


      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

            <UsersIcon
              size={22}
              className="text-blue-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Users
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              CivicAI platform users and roles.
            </p>

          </div>

        </div>


        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0b1728] text-slate-300 hover:text-white"
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-4">

        <div className="relative max-w-md">

          <Search
            size={17}
            className="absolute left-3 top-3 text-slate-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search users..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
          />

        </div>

      </div>


      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl overflow-hidden">

        <div className="grid grid-cols-[70px_1fr_1.4fr_130px_170px] gap-4 px-5 py-3 border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">

          <span>ID</span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Created</span>

        </div>


        {loading ? (

          <div className="p-12 text-center text-slate-500">

            <RefreshCw
              size={28}
              className="mx-auto animate-spin mb-3"
            />

            Loading users...

          </div>

        ) : filtered.length === 0 ? (

          <div className="p-12 text-center text-slate-500">

            No users found.

          </div>

        ) : (

          filtered.map(
            (user) => (

              <div
                key={user.id}
                className="grid grid-cols-[70px_1fr_1.4fr_130px_170px] gap-4 items-center px-5 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-900/50"
              >

                <span className="text-sm text-slate-500">
                  #{user.id}
                </span>


                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">

                    <UserRound
                      size={15}
                      className="text-blue-400"
                    />

                  </div>

                  <span className="text-sm font-medium text-white">
                    {user.name}
                  </span>

                </div>


                <span className="text-sm text-slate-400">
                  {user.email}
                </span>


                <span>

                  <span
                    className={
                      user.role === "admin"
                        ? "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold"
                        : "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold"
                    }
                  >

                    {user.role === "admin" ? (
                      <ShieldCheck size={13} />
                    ) : (
                      <UserRound size={13} />
                    )}

                    {user.role}

                  </span>

                </span>


                <span className="text-xs text-slate-500">

                  {user.created_at
                    ? new Date(
                        user.created_at
                      ).toLocaleDateString()
                    : "—"}

                </span>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}


export default Users;
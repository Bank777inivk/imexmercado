import React, { useEffect, useState } from 'react';
import { getCollection } from '@imexmercado/firebase';
import { 
  Users, MagnifyingGlass, 
  Funnel, DotsThreeVertical,
  UserCircle, CalendarBlank,
  IdentificationBadge
} from '@phosphor-icons/react';

export function CustomersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getCollection('users');
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' ? user.role === 'admin' : user.role !== 'admin');
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight text-left uppercase">Gestion des Clients</h2>
          <p className="text-sm font-medium text-gray-500 text-left">Consultez et gérez les comptes utilisateurs de la plateforme.</p>
        </div>
        <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10 flex items-center gap-2">
           <Users size={18} weight="bold" />
           <span className="text-sm font-black uppercase tracking-widest">{users.length} Inscrits</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un client (nom, email)..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-gray-50 p-1 rounded-2xl">
             {['all', 'customer', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role as any)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    roleFilter === role ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {role === 'all' ? 'Tous' : role === 'admin' ? 'Admins' : 'Clients'}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Utilisateur</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Rôle</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inscription</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Récupération des profils...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <UserCircle size={48} className="mx-auto text-gray-200 mb-4" weight="thin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aucun utilisateur trouvé</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                         user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                       }`}>
                         <IdentificationBadge size={14} weight="bold" />
                         {user.role === 'admin' ? 'Administrateur' : 'Client'}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                        <p className="text-sm font-medium text-gray-600 truncate">{user.email}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{user.phone || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarBlank size={16} />
                        <span className="text-xs font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100">
                        <DotsThreeVertical size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

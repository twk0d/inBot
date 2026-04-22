import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, LogOut, Trash2, Edit2, Search, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.client';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import type { Contact } from '../../types';
import styles from './ContactList.module.css';
import { useState } from 'react';
import { ContactForm } from './ContactForm';
import type { ContactFormData } from './ContactForm';

export function ContactList() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await api.get('/contacts');
      return response.data;
    },
  });

  const filteredContacts = contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const createMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      const cleanData = {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
        address: {
          ...data.address,
          cep: data.address.cep.replace(/\D/g, ''),
        }
      };
      return api.post('/contacts', cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created!');
      handleCloseDrawer();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      const cleanData = {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
        address: {
          ...data.address,
          cep: data.address.cep.replace(/\D/g, ''),
        }
      };
      return api.put(`/contacts/${editingContact?.id}`, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated!');
      handleCloseDrawer();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted');
    },
  });

  const handleOpenAddDrawer = () => {
    setEditingContact(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (contact: Contact) => {
    setEditingContact(contact);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingContact(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) return <div className={styles.loading}>Loading contacts...</div>;

  return (
    <>
      <nav className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.brand}>
            <h2>inBot</h2>
            <span>Welcome, {user?.name}</span>
          </div>

          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Search contacts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.actionsContainer}>
            <Button onClick={handleOpenAddDrawer} size="sm">
              <Plus size={18} /> Add Contact
            </Button>
            <Button variant="ghost" onClick={logout} size="sm">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <main className={styles.container}>
        {isDrawerOpen && (
          <div className={styles.drawerOverlay} onClick={handleCloseDrawer}>
            <div className={styles.drawer} onClick={e => e.stopPropagation()}>
              <div className={styles.drawerHeader}>
                <h2>{editingContact ? "Edit Contact" : "New Contact"}</h2>
                <button className={styles.closeBtn} onClick={handleCloseDrawer}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.drawerBody}>
                <ContactForm
                  onSubmit={async (data) => {
                    if (editingContact) await updateMutation.mutateAsync(data);
                    else await createMutation.mutateAsync(data);
                  }}
                  initialData={editingContact || undefined}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {filteredContacts?.map((contact) => (
            <Card key={contact.id} className={styles.contactCard}>
              <div 
                className={styles.contactSummary} 
                onClick={() => toggleExpand(contact.id)}
              >
                <div className={styles.contactMain}>
                  <div className={styles.avatar}>
                    {getInitials(contact.name)}
                  </div>
                  <div className={styles.info}>
                    <h3>{contact.name}</h3>
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                  </div>
                </div>

                <div className={styles.contactMeta}>
                  <div className={styles.addressBadge}>
                    <MapPin size={14} />
                    <span>{contact.address.city}, {contact.address.state}</span>
                  </div>
                </div>

                <div className={styles.contactActions}>
                  <button 
                    className={styles.actionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDrawer(contact);
                    }} 
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure?')) deleteMutation.mutate(contact.id);
                    }} 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {expandedId === contact.id && (
                <div className={styles.contactDetails}>
                  <div className={styles.detailGroup}>
                    <label>Street & Number</label>
                    <p>{contact.address.street}, {contact.address.number}</p>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Neighborhood</label>
                    <p>{contact.address.neighborhood}</p>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>City & State</label>
                    <p>{contact.address.city} - {contact.address.state}</p>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>ZIP Code</label>
                    <p>{contact.address.cep}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
          
          {contacts?.length === 0 && !isDrawerOpen && (
            <div className={styles.empty}>
              <h3>No contacts yet</h3>
              <p>Click the "Add Contact" button to start building your list.</p>
            </div>
          )}
          
          {contacts?.length !== 0 && filteredContacts?.length === 0 && (
            <div className={styles.empty}>
              <h3>No results found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

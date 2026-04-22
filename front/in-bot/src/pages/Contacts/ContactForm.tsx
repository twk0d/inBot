import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { User, MapPin } from 'lucide-react';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { maskCEP, maskPhone } from '../../utils/masks';
import styles from './ContactForm.module.css';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(14, 'Phone is incomplete'),
  address: z.object({
    cep: z.string().min(8, 'CEP is incomplete'),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'State must be 2 characters').optional(),
    number: z.coerce.number({ message: 'Number is required' }).positive('Number must be positive'),
    observation: z.string().optional().nullable(),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  initialData?: Partial<ContactFormData>;
  isLoading?: boolean;
}

export function ContactForm({ onSubmit, initialData, isLoading }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
    defaultValues: initialData as any,
  });

  const cepValue = watch('address.cep');
  const phoneValue = watch('phone');

  const { address: fetchedAddress, isLoading: isFetchingAddress } = useAddressLookup(cepValue || '');

  useEffect(() => {
    if (fetchedAddress) {
      setValue('address.street', fetchedAddress.street);
      setValue('address.neighborhood', fetchedAddress.neighborhood);
      setValue('address.city', fetchedAddress.city);
      setValue('address.state', fetchedAddress.state);
    }
  }, [fetchedAddress, setValue]);

  useEffect(() => {
    if (cepValue) {
      setValue('address.cep', maskCEP(cepValue));
    }
  }, [cepValue, setValue]);

  useEffect(() => {
    if (phoneValue) {
      setValue('phone', maskPhone(phoneValue));
    }
  }, [phoneValue, setValue]);

  const handleProcessSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleProcessSubmit)} className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <User size={18} />
          <span>Personal Information</span>
        </div>
        <div className={styles.grid}>
          <Input
            label="Name"
            placeholder="Contact Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            placeholder="(11) 99999-9999"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <MapPin size={18} />
          <span>Address Details</span>
          {isFetchingAddress && <span className={styles.loadingText}>Fetching...</span>}
        </div>
        <div className={styles.grid}>
          <Input
            label="CEP"
            placeholder="00000-000"
            error={errors.address?.cep?.message}
            {...register('address.cep')}
          />
          <div className={styles.row}>
            <Input
              label="Street"
              placeholder="Street Name"
              disabled
              {...register('address.street')}
            />
            <Input
              label="Number"
              type="number"
              placeholder="123"
              error={errors.address?.number?.message}
              {...register('address.number')}
            />
          </div>
          <Input
            label="Neighborhood"
            placeholder="Neighborhood"
            disabled
            {...register('address.neighborhood')}
          />
          <div className={styles.row}>
            <Input
              label="City"
              placeholder="City"
              disabled
              {...register('address.city')}
            />
            <Input
              label="State"
              placeholder="UF"
              disabled
              {...register('address.state')}
            />
          </div>
          <Input
            label="Observation"
            placeholder="Appartement, Floor, etc."
            className={styles.fullWidth}
            error={errors.address?.observation?.message}
            {...register('address.observation')}
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
        {initialData ? 'Update Contact' : 'Create Contact'}
      </Button>
    </form>
  );
}

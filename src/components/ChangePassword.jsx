import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '../config/firebaseConfig';
import { fetchSignInMethodsForEmail, updatePassword } from 'firebase/auth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form"

const schema = z.object({
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  }),
});

//TODO  Test with a user that has email/password
const ChangePassword = () => {
  const [canChangePassword, setCanChangePassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchSignInMethodsForEmail(auth, user.email).then((methods) => {
        if (methods.includes('password')) {
          setCanChangePassword(true);
        }
      });
    }
  }, []);

  const onSubmit = (data) => {
    const user = auth.currentUser;
    if (user) {
      updatePassword(user, data.newPassword).then(() => {
        alert('Password updated successfully');
      }).catch((error) => {
        alert('Error updating password: ' + error.message);
      });
    }
  };

  return (
    <div>
      {canChangePassword && (
        <Popover>
          <PopoverTrigger asChild>
            <Button>Change Password</Button>
          </PopoverTrigger>
          <PopoverContent className="bg-popover text-popover-foreground">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <h3>Change Password</h3>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  {...form.register('newPassword')}
                  placeholder="New Password"
                />
              </FormControl>
              <FormMessage/>
              <Button type="submit" variant="secondary">Edit Password</Button>
            </form>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ChangePassword;
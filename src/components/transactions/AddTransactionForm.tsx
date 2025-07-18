
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';
import { CreditCard, Building, Upload } from 'lucide-react';

export const AddTransactionForm: React.FC = () => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards();
  const { categories } = useCategories();
  const { createTransaction } = useTransactions();

  const filteredCategories = categories.filter(cat => cat.transaction_type === type);

  // Combinar contas e cartões de crédito
  const allAccounts = [
    ...accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: 'account' as const,
      accountType: account.type,
      icon: <Building size={16} />
    })),
    ...creditCards.map(card => ({
      id: card.id,
      name: card.name,
      type: 'credit_card' as const,
      accountType: 'credit_card',
      bankName: card.bank_name,
      icon: <CreditCard size={16} />
    }))
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !accountId || !categoryId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Valor deve ser um número positivo');
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        type,
        amount: numericAmount,
        description,
        account_id: accountId,
        category_id: categoryId,
        date,
        status: 'completed',
        receiptFile: receiptFile || undefined,
      });

      toast.success(`${type === 'income' ? 'Receita' : 'Despesa'} adicionada com sucesso!`);
      
      // Limpar formulário
      setAmount('');
      setDescription('');
      setAccountId('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      setReceiptFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense" className="text-red-600">Despesa</TabsTrigger>
                <TabsTrigger value="income" className="text-green-600">Receita</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Almoço, Salário, Compras..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Conta/Cartão *</Label>
              <Select value={accountId} onValueChange={setAccountId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta ou cartão" />
                </SelectTrigger>
                <SelectContent>
                  {allAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center space-x-2">
                        {account.icon}
                        <span>{account.name}</span>
                        <span className="text-xs text-gray-500">
                          {account.type === 'credit_card' ? 
                            `(Cartão - ${account.bankName})` : 
                            '(Conta)'
                          }
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Anexar Comprovante/Nota Fiscal</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Upload size={20} className="text-gray-400" />
              </div>
              {receiptFile && (
                <p className="text-sm text-green-600">
                  Arquivo selecionado: {receiptFile.name}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Adicionando...' : `Adicionar ${type === 'income' ? 'Receita' : 'Despesa'}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

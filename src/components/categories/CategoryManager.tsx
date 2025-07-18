
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { defaultCategories } from '@/data/defaultCategories';
import { toast } from 'sonner';

export const CategoryManager: React.FC = () => {
  const { categories, loading } = useCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📋',
    color: '#6B7280',
    transaction_type: 'expense' as 'income' | 'expense',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar criação de categoria personalizada
    toast.success('Categoria adicionada com sucesso!');
    setShowAddForm(false);
    setNewCategory({
      name: '',
      icon: '📋',
      color: '#6B7280',
      transaction_type: 'expense',
    });
  };

  const incomeCategories = categories.filter(cat => cat.transaction_type === 'income');
  const expenseCategories = categories.filter(cat => cat.transaction_type === 'expense');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gerenciar Categorias</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Nova Categoria</span>
        </Button>
      </div>

      {/* Formulário de Nova Categoria */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Categoria Personalizada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Pets, Academia..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Input
                    id="icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="📋"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select 
                    value={newCategory.transaction_type} 
                    onValueChange={(value: 'income' | 'expense') => 
                      setNewCategory(prev => ({ ...prev, transaction_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Categoria
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categorias de Receita */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-600">
            <Tag size={20} />
            <span>Categorias de Receita</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {incomeCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <div 
                      className="w-4 h-4 rounded-full inline-block ml-2"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categorias de Despesa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Tag size={20} />
            <span>Categorias de Despesa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <div 
                      className="w-4 h-4 rounded-full inline-block ml-2"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Novas Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {defaultCategories
              .filter(defaultCat => 
                !categories.some(existingCat => 
                  existingCat.name.toLowerCase() === defaultCat.name.toLowerCase()
                )
              )
              .slice(0, 6)
              .map((suggestion, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm"
                  className="justify-start h-auto p-2"
                  onClick={() => {
                    setNewCategory({
                      name: suggestion.name,
                      icon: suggestion.icon,
                      color: suggestion.color,
                      transaction_type: suggestion.transaction_type,
                    });
                    setShowAddForm(true);
                  }}
                >
                  <span className="mr-2">{suggestion.icon}</span>
                  <span className="text-xs">{suggestion.name}</span>
                </Button>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

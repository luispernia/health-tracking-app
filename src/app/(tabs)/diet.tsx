import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  FlatList
} from 'react-native';
import { colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Types for food data
type Nutrient = {
  name: string;
  amount: string;
  percent: number;
};

type FoodItem = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  image: string;
  ingredients: string[];
  nutrients: Nutrient[];
};

// Mock data for food items
const FOOD_DATA: FoodItem[] = [
  {
    id: '1',
    name: 'Greek Yogurt Bowl',
    category: 'breakfast',
    calories: 320,
    protein: 22,
    carbs: 38,
    fat: 9,
    time: '8:30 AM',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=2940&auto=format&fit=crop',
    ingredients: ['Greek yogurt', 'Honey', 'Blueberries', 'Granola'],
    nutrients: [
      { name: 'Calcium', amount: '320mg', percent: 30 },
      { name: 'Vitamin D', amount: '2mcg', percent: 10 },
      { name: 'Iron', amount: '1.2mg', percent: 7 },
      { name: 'Potassium', amount: '450mg', percent: 12 },
      { name: 'Fiber', amount: '4g', percent: 16 }
    ]
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    category: 'lunch',
    calories: 420,
    protein: 38,
    carbs: 24,
    fat: 18,
    time: '12:45 PM',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop',
    ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Balsamic dressing'],
    nutrients: [
      { name: 'Vitamin A', amount: '520mcg', percent: 58 },
      { name: 'Vitamin C', amount: '45mg', percent: 50 },
      { name: 'Iron', amount: '2.5mg', percent: 14 },
      { name: 'Potassium', amount: '680mg', percent: 19 },
      { name: 'Fiber', amount: '6g', percent: 24 }
    ]
  },
  {
    id: '3',
    name: 'Salmon with Quinoa',
    category: 'dinner',
    calories: 580,
    protein: 42,
    carbs: 48,
    fat: 22,
    time: '7:15 PM',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2874&auto=format&fit=crop',
    ingredients: ['Atlantic salmon', 'Quinoa', 'Broccoli', 'Lemon', 'Olive oil', 'Herbs'],
    nutrients: [
      { name: 'Omega-3', amount: '1.8g', percent: 120 },
      { name: 'Vitamin D', amount: '15mcg', percent: 75 },
      { name: 'Vitamin B12', amount: '4.2mcg', percent: 176 },
      { name: 'Selenium', amount: '45mcg', percent: 82 },
      { name: 'Magnesium', amount: '120mg', percent: 29 }
    ]
  },
  {
    id: '4',
    name: 'Apple with Almond Butter',
    category: 'snack',
    calories: 180,
    protein: 4,
    carbs: 22,
    fat: 10,
    time: '3:30 PM',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=2070&auto=format&fit=crop',
    ingredients: ['Apple', 'Almond butter'],
    nutrients: [
      { name: 'Fiber', amount: '5g', percent: 20 },
      { name: 'Vitamin C', amount: '8mg', percent: 9 },
      { name: 'Vitamin E', amount: '3mg', percent: 20 },
      { name: 'Magnesium', amount: '45mg', percent: 11 },
      { name: 'Potassium', amount: '200mg', percent: 6 }
    ]
  },
  {
    id: '5',
    name: 'Protein Smoothie',
    category: 'snack',
    calories: 250,
    protein: 20,
    carbs: 30,
    fat: 5,
    time: '10:30 AM',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?q=80&w=2787&auto=format&fit=crop',
    ingredients: ['Whey protein', 'Banana', 'Almond milk', 'Spinach', 'Chia seeds'],
    nutrients: [
      { name: 'Calcium', amount: '240mg', percent: 24 },
      { name: 'Iron', amount: '2mg', percent: 11 },
      { name: 'Potassium', amount: '550mg', percent: 16 },
      { name: 'Vitamin A', amount: '120mcg', percent: 13 },
      { name: 'Fiber', amount: '6g', percent: 24 }
    ]
  }
];

// Calculate daily totals from food data
const calculateDailyTotals = () => {
  return FOOD_DATA.reduce((totals, food) => {
    return {
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

// Main Diet Screen Component
export default function DietScreen() {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Daily nutritional totals
  const dailyTotals = calculateDailyTotals();
  
  // Filter foods by category
  const filteredFoods = activeCategory === 'all' 
    ? FOOD_DATA 
    : FOOD_DATA.filter(food => food.category === activeCategory);
    
  // Get macro percentages for charts
  const totalMacros = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat;
  const proteinPercent = Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100);
  const carbsPercent = Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100);
  const fatPercent = Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100);
  
  // Handle opening food detail modal
  const openFoodDetail = (food: FoodItem) => {
    setSelectedFood(food);
    setModalVisible(true);
  };
  
  // Render category pills
  const renderCategoryPills = () => {
    const categories = [
      { id: 'all', label: 'All' },
      { id: 'breakfast', label: 'Breakfast' },
      { id: 'lunch', label: 'Lunch' },
      { id: 'dinner', label: 'Dinner' },
      { id: 'snack', label: 'Snacks' }
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoryPillsContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryPill, 
              activeCategory === category.id && styles.activeCategoryPill
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryPillText, 
                activeCategory === category.id && styles.activeCategoryPillText
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  // Render individual food item
  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    return (
      <TouchableOpacity 
        style={styles.foodCard} 
        onPress={() => openFoodDetail(item)}
      >
        <View style={styles.foodCardLeft}>
          <View style={styles.foodImageContainer}>
            {item.image && (
              <Image 
                source={{ uri: item.image }} 
                style={styles.foodImage} 
                resizeMode="cover" 
              />
            )}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.foodCardRight}>
          <View style={styles.foodCardHeader}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodTime}>{item.time}</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.calories}</Text>
              <Text style={styles.macroLabel}>Cal</Text>
            </View>
            <View style={styles.macroSeparator} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroSeparator} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroSeparator} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render food detail modal
  const renderFoodDetailModal = () => {
    if (!selectedFood) return null;
    
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedFood.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {selectedFood.image && (
                <Image 
                  source={{ uri: selectedFood.image }} 
                  style={styles.detailImage} 
                  resizeMode="cover" 
                />
              )}
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Nutrition Facts</Text>
                <View style={styles.detailMacros}>
                  <View style={styles.detailMacroItem}>
                    <Text style={styles.detailMacroValue}>{selectedFood.calories}</Text>
                    <Text style={styles.detailMacroLabel}>Calories</Text>
                  </View>
                  <View style={styles.macroSeparator} />
                  <View style={styles.detailMacroItem}>
                    <Text style={styles.detailMacroValue}>{selectedFood.protein}g</Text>
                    <Text style={styles.detailMacroLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroSeparator} />
                  <View style={styles.detailMacroItem}>
                    <Text style={styles.detailMacroValue}>{selectedFood.carbs}g</Text>
                    <Text style={styles.detailMacroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroSeparator} />
                  <View style={styles.detailMacroItem}>
                    <Text style={styles.detailMacroValue}>{selectedFood.fat}g</Text>
                    <Text style={styles.detailMacroLabel}>Fat</Text>
                  </View>
                </View>
                
                {/* Macro bars visualization */}
                <View style={styles.macroBarsContainer}>
                  <View style={styles.macroBarRow}>
                    <Text style={styles.macroBarLabel}>Protein</Text>
                    <View style={styles.macroBarTrack}>
                      <View 
                        style={[
                          styles.macroBarFill, 
                          styles.proteinBar, 
                          { width: `${(selectedFood.protein * 4 / selectedFood.calories) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.macroBarPercent}>
                      {Math.round((selectedFood.protein * 4 / selectedFood.calories) * 100)}%
                    </Text>
                  </View>
                  
                  <View style={styles.macroBarRow}>
                    <Text style={styles.macroBarLabel}>Carbs</Text>
                    <View style={styles.macroBarTrack}>
                      <View 
                        style={[
                          styles.macroBarFill, 
                          styles.carbsBar, 
                          { width: `${(selectedFood.carbs * 4 / selectedFood.calories) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.macroBarPercent}>
                      {Math.round((selectedFood.carbs * 4 / selectedFood.calories) * 100)}%
                    </Text>
                  </View>
                  
                  <View style={styles.macroBarRow}>
                    <Text style={styles.macroBarLabel}>Fat</Text>
                    <View style={styles.macroBarTrack}>
                      <View 
                        style={[
                          styles.macroBarFill, 
                          styles.fatBar, 
                          { width: `${(selectedFood.fat * 9 / selectedFood.calories) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.macroBarPercent}>
                      {Math.round((selectedFood.fat * 9 / selectedFood.calories) * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsList}>
                  {selectedFood.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Micronutrients</Text>
                <View style={styles.nutrientsList}>
                  {selectedFood.nutrients.map((nutrient, index) => (
                    <View key={index} style={styles.nutrientRow}>
                      <View style={styles.nutrientNameColumn}>
                        <Text style={styles.nutrientName}>{nutrient.name}</Text>
                      </View>
                      <View style={styles.nutrientValueColumn}>
                        <Text style={styles.nutrientValue}>{nutrient.amount}</Text>
                      </View>
                      <View style={styles.nutrientPercentColumn}>
                        <View style={styles.nutrientPercentBar}>
                          <View 
                            style={[
                              styles.nutrientPercentFill, 
                              { width: `${Math.min(nutrient.percent, 100)}%` },
                              nutrient.percent > 50 ? styles.highNutrientBar : styles.lowNutrientBar
                            ]} 
                          />
                        </View>
                        <Text style={styles.nutrientPercent}>{nutrient.percent}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Track</Text>
            <Text style={styles.title}>Diet & Nutrition</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>
        
        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Daily Summary</Text>
          <View style={styles.summaryMacros}>
            <View style={styles.summaryMacroItem}>
              <Text style={styles.summaryMacroValue}>{dailyTotals.calories}</Text>
              <Text style={styles.summaryMacroLabel}>Calories</Text>
            </View>
            
            <View style={styles.macroCircleContainer}>
              {/* Macro percentage circles */}
              <View style={styles.macroCircleWrapper}>
                <View style={styles.macroCircle}>
                  <View style={[styles.macroCircleSegment, styles.proteinSegment, { height: `${proteinPercent}%` }]} />
                  <View style={[styles.macroCircleSegment, styles.carbsSegment, { height: `${carbsPercent}%` }]} />
                  <View style={[styles.macroCircleSegment, styles.fatSegment, { height: `${fatPercent}%` }]} />
                </View>
              </View>
              
              {/* Macro legend */}
              <View style={styles.macroLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, styles.proteinColor]} />
                  <Text style={styles.legendText}>Protein {proteinPercent}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, styles.carbsColor]} />
                  <Text style={styles.legendText}>Carbs {carbsPercent}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, styles.fatColor]} />
                  <Text style={styles.legendText}>Fat {fatPercent}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Category pills */}
        {renderCategoryPills()}
        
        {/* Food list */}
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.foodList}
        />
      </View>
      
      {/* Food Detail Modal */}
      {renderFoodDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Summary Card Styles
  summaryCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMacroItem: {
    alignItems: 'center',
  },
  summaryMacroValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  summaryMacroLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  // Macro Circle Styles
  macroCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroCircleWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  macroCircleSegment: {
    width: '100%',
  },
  proteinSegment: {
    backgroundColor: '#FF9500',
  },
  carbsSegment: {
    backgroundColor: '#34C759',
  },
  fatSegment: {
    backgroundColor: '#007AFF',
  },
  macroLegend: {
    marginLeft: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  proteinColor: {
    backgroundColor: '#FF9500',
  },
  carbsColor: {
    backgroundColor: '#34C759',
  },
  fatColor: {
    backgroundColor: '#007AFF',
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  
  // Category Pills Styles
  categoryPillsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  activeCategoryPill: {
    backgroundColor: colors.primaryYellow,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeCategoryPillText: {
    color: colors.background,
  },
  
  // Food Card Styles
  foodList: {
    paddingBottom: 80,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  foodCardLeft: {
    width: 100,
  },
  foodImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  categoryTagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  foodCardRight: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  foodTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  macroLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  macroSeparator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  detailMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailMacroItem: {
    alignItems: 'center',
  },
  detailMacroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailMacroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  // Macro bars
  macroBarsContainer: {
    marginTop: 8,
  },
  macroBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroBarLabel: {
    width: 50,
    fontSize: 14,
    color: colors.textSecondary,
  },
  macroBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  proteinBar: {
    backgroundColor: '#FF9500',
  },
  carbsBar: {
    backgroundColor: '#34C759',
  },
  fatBar: {
    backgroundColor: '#007AFF',
  },
  macroBarPercent: {
    width: 40,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  
  // Ingredients
  ingredientsList: {
    marginTop: 4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryYellow,
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: colors.text,
  },
  
  // Nutrients
  nutrientsList: {
    marginTop: 4,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientNameColumn: {
    width: 100,
  },
  nutrientName: {
    fontSize: 14,
    color: colors.text,
  },
  nutrientValueColumn: {
    width: 60,
  },
  nutrientValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nutrientPercentColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientPercentBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  nutrientPercentFill: {
    height: '100%',
    borderRadius: 3,
  },
  highNutrientBar: {
    backgroundColor: '#34C759',
  },
  lowNutrientBar: {
    backgroundColor: '#FF9500',
  },
  nutrientPercent: {
    width: 36,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
}); 